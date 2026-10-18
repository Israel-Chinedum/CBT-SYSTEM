// ============================================================
// REAL API SERVICE
// Same function names as mockApi.js, so the pages only changed
// their import line. Anything marked GUESS below is an assumption
// about the server's response; check it against the console logs.
// ============================================================

const API_URL =
    import.meta.env?.VITE_API_URL || "https://cbt-system-server.onrender.com";

// The backend expects the raw token in the Authorization header
// (no "Bearer " in front), as confirmed by the backend developer.
const AUTH_PREFIX = "";

const SESSION_KEY = "cbt_auth";   // same key AuthContext uses
const QUESTIONS_PER_EXAM = 10;

// Debug logs only appear while developing (npm run dev), never in a live build
const debug = (...args) => {
    if (import.meta.env?.DEV) console.log(...args);
};


// ---------- Subjects ----------
// No subjects endpoint yet, so they live here for now.
// `apiSubject` must be EXACTLY what the server expects in ?subject=...
// (confirm "mathematics" with your backend dev).

const SUBJECTS = [
    { id: "mathematics", apiSubject: "mathematics", name: "Mathematics", description: "Arithmetic, algebra, geometry and statistics.", durationMinutes: 20, passMark: 50, icon: "calculator" },
    { id: "english", apiSubject: "english", name: "English Language", description: "Grammar, vocabulary and sentence structure.", durationMinutes: 15, passMark: 50, icon: "book" },
    { id: "physics", apiSubject: "physics", name: "Physics", description: "Mechanics, electricity, light and energy.", durationMinutes: 15, passMark: 50, icon: "atom" },
    { id: "chemistry", apiSubject: "chemistry", name: "Chemistry", description: "Atoms, elements, acids and everyday chemistry.", durationMinutes: 15, passMark: 50, icon: "flask" }
].map((s) => ({ ...s, questionCount: QUESTIONS_PER_EXAM }));


// ---------- Session helpers ----------

function readSession() {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function clearSession() {
    try {
        localStorage.removeItem(SESSION_KEY);
    } catch {
        // ignore
    }
}


// ---------- One place that talks to the server ----------

async function request(path, options = {}) {

    const token = readSession()?.token;

    const headers = {};
    if (options.body) headers["Content-Type"] = "application/json";
    if (token) headers.Authorization = `${AUTH_PREFIX}${token}`;

    const response = await fetch(`${API_URL}${path}`, { ...options, headers });

    // Token missing, wrong or expired: log the student out
    if (response.status === 401) {
        clearSession();
        window.location.assign("/login");
        throw new Error("Session expired. Please log in again.");
    }

    let data = null;
    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        throw new Error(data?.message || `Request failed (${response.status})`);
    }

    return data;
}


// ---------- Question format converter (GUESS) ----------
// Turns whatever the server sends into { id, text, options: [text, ...] }.
// If questions look wrong on screen, check the "Questions response" log
// in the browser console and adjust the field names here.

function toQuestion(raw) {

    const id = raw.id ?? raw._id ?? raw.questionId;

    const text =
        raw.question ?? raw.text ?? raw.questionText ?? raw.title ?? "";

    let options = raw.options ?? raw.choices ?? raw.answers ?? [];

    if (!Array.isArray(options) && typeof options === "object") {
        options = Object.values(options);       // { a: "...", b: "..." }
    }

    options = options.map((option) =>
        typeof option === "string"
            ? option
            : String(option?.text ?? option?.option ?? option?.value ?? "")
    );

    return {
        id: id == null ? "" : String(id),
        text,
        options,
        topic: raw.topic ?? ""
    };
}


// ============================================================
// Functions the pages call
// ============================================================

// Subjects (local for now)
export async function getSubjects() {
    return SUBJECTS;
}


// GET /quiz/questions?subject=chemistry&limit=10
export async function getExam(subjectId) {

    const subject = SUBJECTS.find((s) => s.id === subjectId);
    if (!subject) throw new Error("Subject not found");

    const data = await request(
        `/quiz/questions?subject=${encodeURIComponent(subject.apiSubject)}&limit=${subject.questionCount}`
    );

    debug("Questions response:", JSON.stringify(data, null, 2));

    // The list may be the response itself or sit inside a field (GUESS)
    const list = Array.isArray(data)
        ? data
        : data?.questions ?? data?.data ?? data?.results ?? [];

    const questions = list
        .map(toQuestion)
        .filter((q) => q.id && q.text && q.options.length > 0);

    if (questions.length === 0) {
        throw new Error("No questions were returned for this subject.");
    }

    return {
        subject: { ...subject, questionCount: questions.length },
        questions
    };
}


// POST /quiz/answers   { answers: [{ id, subject, answer }] }
// `answers` from the page is { [questionId]: optionIndex };
// we turn each index into the option's TEXT, as the server expects.
export async function submitExam(subjectId, answers, questions) {

    const subject = SUBJECTS.find((s) => s.id === subjectId);
    if (!subject) throw new Error("Subject not found");

    const payload = {
        answers: questions
            .filter((q) => answers[q.id] !== undefined)
            .map((q) => ({
                id: q.id,
                subject: subject.apiSubject,
                answer: q.options[answers[q.id]]
            }))
    };

    const data = await request("/quiz/answers", {
        method: "POST",
        body: JSON.stringify(payload)
    });

    debug("Submit response:", JSON.stringify(data, null, 2));

    // Read the score from the server's reply (GUESS on field names)
    const total = data?.total ?? data?.totalQuestions ?? questions.length;
    // The server replies with unit_scores per subject, e.g.
    // { unit_scores: { physics: 7, ... }, total_score: 7 }
    // ASSUMPTION: these are counts of correct answers (not percentages).
    const score =
        data?.score ??
        data?.unit_scores?.[subject.apiSubject] ??
        data?.total_score ??
        0;
    const percentage =
        data?.percentage ?? (total ? Math.round((score / total) * 100) : 0);
    const passed = data?.passed ?? percentage >= subject.passMark;

    const result = {
        id: `r-${Date.now()}`,
        subjectId,
        subjectName: subject.name,
        score,
        total,
        percentage,
        date: new Date().toISOString(),
        passed
    };

    return result;
}


// ---------- Results: GET /quiz/get-history ----------
// Each record is one submitted exam. Today a record looks like:
//   { _id, email, unit_scores: { english: "0", mathematics: "6", ... }, total_score, average }
// It has no subject, question total or date field yet, so we work them out:
//   - date: a MongoDB _id starts with its creation time
//   - subject: the one with a non-zero score (an all-zero record cannot be matched)
//   - total: assumed to be QUESTIONS_PER_EXAM
// When the backend adds subject / total / createdAt, those are used instead.

function dateFromRecord(record) {

    const explicit = record.createdAt ?? record.created_at ?? record.date;

    if (explicit) {
        const parsed = new Date(explicit);
        if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
    }

    const seconds = parseInt(String(record._id ?? record.id ?? "").slice(0, 8), 16);

    return Number.isFinite(seconds)
        ? new Date(seconds * 1000).toISOString()
        : new Date().toISOString();
}


function toHistoryResults(record) {

    const date = dateFromRecord(record);
    const baseId = String(record._id ?? record.id ?? date);

    // Future shape: one subject per record
    if (record.subject) {

        const subject = SUBJECTS.find(
            (s) => s.apiSubject === record.subject || s.id === record.subject
        );

        const total = Number(record.total) || QUESTIONS_PER_EXAM;
        const score = Number(record.score ?? 0);
        const percentage = Number(
            record.percentage ?? Math.round((score / total) * 100)
        );

        return [{
            id: baseId,
            subjectId: subject?.id ?? record.subject,
            subjectName: subject?.name ?? record.subject,
            score,
            total,
            percentage,
            date,
            passed: record.passed ?? percentage >= (subject?.passMark ?? 50)
        }];
    }

    // Current shape: scores for every subject in one record
    const scores = record.unit_scores ?? {};
    const taken = SUBJECTS.filter((s) => Number(scores[s.apiSubject]) > 0);

    return (taken.length ? taken : [null]).map((subject) => {

        const score = subject ? Number(scores[subject.apiSubject]) : 0;
        const total = QUESTIONS_PER_EXAM;
        const percentage = Math.round((score / total) * 100);

        return {
            id: subject ? `${baseId}-${subject.id}` : baseId,
            subjectId: subject?.id ?? "unknown",
            subjectName: subject?.name ?? "Subject not recorded",
            score,
            total,
            percentage,
            date,
            passed: subject ? percentage >= subject.passMark : false
        };
    });
}


export async function getResults() {

    const data = await request("/quiz/get-history");

    debug("History response:", JSON.stringify(data, null, 2));

    const list = Array.isArray(data)
        ? data
        : data?.history ?? data?.data ?? data?.results ?? [];

    return list
        .flatMap(toHistoryResults)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
}
