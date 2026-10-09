import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    Clock,
    Flag,
    ChevronLeft,
    ChevronRight,
    LayoutGrid,
    CheckCircle2,
    XCircle,
    Loader2
} from "lucide-react";
import { Colors } from "/src/components/Color";
import { Modal } from "/src/components/Modal";
import { useAuth } from "/src/context/AuthContext";
import { getExam, submitExam } from "/src/services/mockApi";
import {
    getAttempt,
    saveAttempt,
    clearAttempt,
    userKeyFrom
} from "/src/utils/attemptStorage";

const LETTERS = ["A", "B", "C", "D", "E"];

const pad = (n) => String(n).padStart(2, "0");

function formatTime(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}


// ------------------------------------------------------------
// Question navigator (used in the side panel and mobile drawer)
// ------------------------------------------------------------

function Navigator({ questions, answers, flagged, current, onJump, onSubmit, disabled }) {

    const answeredCount = questions.filter((q) => answers[q.id] !== undefined).length;

    return (
        <div>
            <p className="text-sm font-semibold text-slate-800">
                Questions
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
                {answeredCount} of {questions.length} answered
            </p>

            <div className="mt-4 grid grid-cols-5 gap-2">
                {questions.map((q, index) => {

                    const isCurrent = index === current;
                    const isFlagged = flagged[q.id];
                    const isAnswered = answers[q.id] !== undefined;

                    let tone = "bg-white border border-slate-300 text-slate-600";
                    let toneStyle;
                    if (isAnswered) {
                        tone = "border text-white";
                        toneStyle = { background: Colors.dark, borderColor: Colors.dark };
                    }
                    if (isFlagged) {
                        tone = "bg-amber-400 border border-amber-400 text-white";
                        toneStyle = undefined;
                    }

                    return (
                        <button
                            key={q.id}
                            onClick={() => onJump(index)}
                            aria-label={`Go to question ${index + 1}`}
                            aria-current={isCurrent ? "true" : undefined}
                            className={`h-10 rounded-lg text-sm font-medium transition-colors ${tone} ${
                                isCurrent ? "ring-2 ring-offset-2" : ""
                            }`}
                            style={{
                                ...toneStyle,
                                ...(isCurrent ? { "--tw-ring-color": Colors.dark } : {})
                            }}
                        >
                            {index + 1}
                        </button>
                    );
                })}
            </div>

            <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                <p className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded" style={{ background: Colors.dark }} /> Answered
                </p>
                <p className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-amber-400" /> Flagged for review
                </p>
                <p className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded border border-slate-300 bg-white" /> Not answered
                </p>
            </div>

            <button
                onClick={onSubmit}
                disabled={disabled}
                className="mt-5 w-full h-11 rounded-xl text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
                style={{ background: Colors.gradient }}
            >
                Submit exam
            </button>
        </div>
    );
}


// ------------------------------------------------------------
// Exam page
// ------------------------------------------------------------

export function ExamPage() {

    const { subjectId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const userKey = userKeyFrom(user);

    const [status, setStatus] = useState("loading"); // loading | error | active | submitting | done
    const [exam, setExam] = useState(null);
    const [answers, setAnswers] = useState({});
    const [flagged, setFlagged] = useState({});
    const [current, setCurrent] = useState(0);
    const [endsAt, setEndsAt] = useState(0);
    const [remaining, setRemaining] = useState(0);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [result, setResult] = useState(null);
    const [submitError, setSubmitError] = useState("");

    const submittingRef = useRef(false);
    const autoSubmitTried = useRef(false);
    const latestAnswers = useRef({});
    latestAnswers.current = answers;

    const gradientStyle = { background: Colors.gradient };


    // ---------- Load the exam, restore a saved attempt or start a new one ----------

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const data = await getExam(subjectId);
                if (cancelled) return;

                const saved = getAttempt(userKey, subjectId);
                let deadline;

                if (saved) {
                    deadline = saved.endsAt;
                    setAnswers(saved.answers || {});
                    setFlagged(saved.flagged || {});
                    setCurrent(Math.min(saved.current || 0, data.questions.length - 1));
                } else {
                    deadline = Date.now() + data.subject.durationMinutes * 60 * 1000;
                    saveAttempt(userKey, subjectId, {
                        endsAt: deadline,
                        answers: {},
                        flagged: {},
                        current: 0
                    });
                }

                setExam(data);
                setEndsAt(deadline);
                setRemaining(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
                setStatus("active");

            } catch {
                if (!cancelled) setStatus("error");
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [subjectId, userKey]);


    // ---------- Autosave on every change ----------

    useEffect(() => {
        if (status !== "active") return;
        saveAttempt(userKey, subjectId, { endsAt, answers, flagged, current });
    }, [status, endsAt, answers, flagged, current, userKey, subjectId]);


    // ---------- Submit ----------

    const handleSubmit = useCallback(async () => {

        if (submittingRef.current) return;
        submittingRef.current = true;

        setConfirmOpen(false);
        setDrawerOpen(false);
        setSubmitError("");
        setStatus("submitting");

        try {
            const res = await submitExam(subjectId, latestAnswers.current);
            clearAttempt(userKey, subjectId);
            setResult(res);
            setStatus("done");
        } catch {
            submittingRef.current = false;
            setSubmitError("Could not submit your exam. Check your connection and try again.");
            setStatus("active");
        }
    }, [subjectId, userKey]);


    // ---------- Countdown (based on the end time, so refresh cannot reset it) ----------

    useEffect(() => {
        if (status !== "active") return;

        const tick = () => {
            const left = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
            setRemaining(left);

            if (left === 0 && !autoSubmitTried.current) {
                autoSubmitTried.current = true;
                handleSubmit();
            }
        };

        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [status, endsAt, handleSubmit]);


    // ---------- Warn before closing or refreshing mid-exam ----------

    useEffect(() => {
        if (status !== "active") return;

        const warn = (e) => {
            e.preventDefault();
            e.returnValue = "";
        };

        window.addEventListener("beforeunload", warn);
        return () => window.removeEventListener("beforeunload", warn);
    }, [status]);


    // ---------- Screens other than the exam itself ----------

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center text-slate-500" style={{ background: Colors.background }}>
                <Loader2 className="animate-spin mr-2" size={20} />
                Loading exam…
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center" style={{ background: Colors.background }}>
                <p className="text-slate-700">We could not load this exam.</p>
                <Link
                    to="/dashboard/subjects"
                    className="mt-3 text-sm font-semibold underline"
                    style={{ color: Colors.dark }}
                >
                    Back to subjects
                </Link>
            </div>
        );
    }

    if (status === "done" && result) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4" style={{ background: Colors.background }}>
                <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 text-center">

                    {result.passed ? (
                        <CheckCircle2 size={48} className="mx-auto text-green-600" />
                    ) : (
                        <XCircle size={48} className="mx-auto text-red-500" />
                    )}

                    <h1 className="mt-4 text-xl font-semibold text-slate-800">
                        Exam submitted
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {result.subjectName}
                    </p>

                    <p className="mt-6 text-5xl font-semibold text-slate-800">
                        {result.percentage}%
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                        {result.score} of {result.total} correct
                    </p>

                    <span
                        className={`inline-block mt-4 px-3 py-1 rounded-full text-sm font-semibold ${
                            result.passed
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }`}
                    >
                        {result.passed ? "Passed" : "Failed"} · pass mark {exam.subject.passMark}%
                    </span>

                    <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => navigate("/dashboard/results", { replace: true })}
                            className="h-11 px-5 rounded-xl text-sm font-medium text-white hover:opacity-90"
                            style={gradientStyle}
                        >
                            View my results
                        </button>
                        <button
                            onClick={() => navigate("/dashboard/subjects", { replace: true })}
                            className="h-11 px-5 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Back to subjects
                        </button>
                    </div>

                </div>
            </div>
        );
    }


    // ---------- The exam ----------

    const questions = exam.questions;
    const question = questions[current];
    const total = questions.length;

    const answeredCount = questions.filter((q) => answers[q.id] !== undefined).length;
    const flaggedCount = questions.filter((q) => flagged[q.id]).length;
    const unanswered = total - answeredCount;

    const timeUp = remaining === 0;
    const lowTime = remaining <= 300;
    const isLast = current === total - 1;

    const selectOption = (optionIndex) => {
        if (timeUp) return;
        setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }));
    };

    const clearAnswer = () => {
        setAnswers((prev) => {
            const next = { ...prev };
            delete next[question.id];
            return next;
        });
    };

    const toggleFlag = () => {
        setFlagged((prev) => ({ ...prev, [question.id]: !prev[question.id] }));
    };

    const jumpTo = (index) => {
        setCurrent(index);
        setDrawerOpen(false);
    };

    const busy = status === "submitting";


    return (
        <div className="min-h-screen flex flex-col" style={{ background: Colors.background }}>

            {/* ---------------- Header ---------------- */}
            <header
                className="sticky top-0 z-30 text-white"
                style={gradientStyle}
            >
                <div className="max-w-6xl mx-auto h-16 px-4 lg:px-6 flex items-center justify-between gap-3">

                    <div className="min-w-0">
                        <p className="font-semibold text-[15px] truncate">
                            {exam.subject.name}
                        </p>
                        <p className="text-xs text-white/70">
                            Question {current + 1} of {total}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">

                        <div
                            role="timer"
                            aria-label="Time remaining"
                            className={`flex items-center gap-2 h-10 px-3 rounded-xl font-mono text-sm font-semibold ${
                                lowTime ? "bg-red-500" : "bg-white/15"
                            } ${remaining > 0 && remaining <= 60 ? "animate-pulse" : ""}`}
                        >
                            <Clock size={16} />
                            {formatTime(remaining)}
                        </div>

                        <button
                            onClick={() => setDrawerOpen(true)}
                            aria-label="Open question navigator"
                            className="lg:hidden h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center"
                        >
                            <LayoutGrid size={18} />
                        </button>

                    </div>
                </div>
            </header>


            {/* ---------------- Body ---------------- */}
            <main className="flex-1 w-full max-w-6xl mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">

                <section>

                    {submitError && (
                        <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-700 text-sm flex items-center justify-between gap-4">
                            <span>{submitError}</span>
                            <button onClick={handleSubmit} className="font-semibold underline shrink-0">
                                Retry
                            </button>
                        </div>
                    )}

                    {timeUp && !submitError && (
                        <div className="mb-4 p-4 rounded-xl bg-amber-50 text-amber-800 text-sm">
                            Time is up. Submitting your answers…
                        </div>
                    )}

                    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8">

                        <div className="flex items-center justify-between gap-3">
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                                Question {current + 1}
                            </p>

                            <button
                                onClick={toggleFlag}
                                aria-pressed={Boolean(flagged[question.id])}
                                className={`h-9 px-3 rounded-lg text-sm flex items-center gap-2 border transition-colors ${
                                    flagged[question.id]
                                        ? "bg-amber-50 border-amber-300 text-amber-700"
                                        : "border-slate-200 text-slate-500 hover:bg-slate-50"
                                }`}
                            >
                                <Flag size={15} />
                                {flagged[question.id] ? "Flagged" : "Flag for review"}
                            </button>
                        </div>

                        <h1 className="mt-4 text-lg sm:text-xl text-slate-800 leading-snug">
                            {question.text}
                        </h1>

                        <div className="mt-6 space-y-3" role="radiogroup" aria-label="Answer options">
                            {question.options.map((option, optionIndex) => {

                                const chosen = answers[question.id] === optionIndex;

                                return (
                                    <button
                                        key={optionIndex}
                                        role="radio"
                                        aria-checked={chosen}
                                        onClick={() => selectOption(optionIndex)}
                                        disabled={timeUp}
                                        className={`w-full flex items-center gap-4 text-left rounded-xl border px-4 py-3.5 transition-colors ${
                                            chosen
                                                ? ""
                                                : "border-slate-200 hover:bg-slate-50"
                                        }`}
                                        style={chosen ? { borderColor: Colors.dark, background: Colors.background } : undefined}
                                    >
                                        <span
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                                                chosen
                                                    ? "text-white"
                                                    : "bg-slate-100 text-slate-600"
                                            }`}
                                            style={chosen ? { background: Colors.dark } : undefined}
                                        >
                                            {LETTERS[optionIndex]}
                                        </span>
                                        <span className="text-[15px] text-slate-800">
                                            {option}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {answers[question.id] !== undefined && !timeUp && (
                            <button
                                onClick={clearAnswer}
                                className="mt-4 text-sm text-slate-500 underline"
                            >
                                Clear my answer
                            </button>
                        )}

                    </div>


                    {/* Previous / Next */}
                    <div className="mt-4 flex items-center justify-between gap-3">

                        <button
                            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                            disabled={current === 0}
                            className="h-11 px-4 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-700 flex items-center gap-1 disabled:opacity-40"
                        >
                            <ChevronLeft size={18} />
                            Previous
                        </button>

                        {isLast ? (
                            <button
                                onClick={() => setConfirmOpen(true)}
                                disabled={busy}
                                className="h-11 px-5 rounded-xl text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
                                style={gradientStyle}
                            >
                                Finish & submit
                            </button>
                        ) : (
                            <button
                                onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))}
                                className="h-11 px-4 rounded-xl text-sm font-medium text-white flex items-center gap-1 hover:opacity-90"
                                style={gradientStyle}
                            >
                                Next
                                <ChevronRight size={18} />
                            </button>
                        )}

                    </div>

                </section>


                {/* Desktop navigator */}
                <aside className="hidden lg:block sticky top-24 bg-white rounded-2xl border border-slate-200 p-5">
                    <Navigator
                        questions={questions}
                        answers={answers}
                        flagged={flagged}
                        current={current}
                        onJump={jumpTo}
                        onSubmit={() => setConfirmOpen(true)}
                        disabled={busy}
                    />
                </aside>

            </main>


            {/* ---------------- Mobile navigator drawer ---------------- */}
            {drawerOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setDrawerOpen(false)}
                        aria-hidden="true"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-2xl p-5 max-h-[80vh] overflow-y-auto">
                        <Navigator
                            questions={questions}
                            answers={answers}
                            flagged={flagged}
                            current={current}
                            onJump={jumpTo}
                            onSubmit={() => {
                                setDrawerOpen(false);
                                setConfirmOpen(true);
                            }}
                            disabled={busy}
                        />
                    </div>
                </div>
            )}


            {/* ---------------- Confirm submit ---------------- */}
            {confirmOpen && (
                <Modal
                    title="Submit your exam?"
                    onClose={() => setConfirmOpen(false)}
                    actions={
                        <>
                            <button
                                onClick={() => setConfirmOpen(false)}
                                className="h-10 px-4 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Keep working
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="h-10 px-4 rounded-xl text-sm font-medium text-white hover:opacity-90"
                                style={gradientStyle}
                            >
                                Submit now
                            </button>
                        </>
                    }
                >
                    <p>
                        You have answered <strong>{answeredCount}</strong> of {total} questions.
                    </p>

                    {unanswered > 0 && (
                        <p className="mt-2 text-red-600">
                            {unanswered} {unanswered === 1 ? "question is" : "questions are"} still unanswered.
                        </p>
                    )}

                    {flaggedCount > 0 && (
                        <p className="mt-2 text-amber-700">
                            {flaggedCount} {flaggedCount === 1 ? "question is" : "questions are"} flagged for review.
                        </p>
                    )}

                    <p className="mt-3">
                        Once submitted, you cannot change your answers.
                    </p>
                </Modal>
            )}


            {/* ---------------- Submitting overlay ---------------- */}
            {busy && (
                <div className="fixed inset-0 z-[70] bg-white/80 flex items-center justify-center text-slate-600">
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Submitting your exam…
                </div>
            )}

        </div>
    );
}
