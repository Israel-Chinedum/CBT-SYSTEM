// ============================================================
// MOCK API - temporary stand-in for the real backend.
//
// Every function is async and returns the shape we expect the
// real endpoints to return. When the backend is ready, only the
// INSIDE of each function changes (to a fetch call). The pages
// that use these functions stay exactly the same.
// ============================================================

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

const RESULTS_KEY = "cbt_mock_results";


// ---------- Subjects (the server will own these) ----------

const SUBJECTS = [
    {
        id: "mathematics",
        name: "Mathematics",
        description: "Arithmetic, algebra, geometry and statistics.",
        durationMinutes: 20,
        passMark: 50,
        icon: "calculator"
    },
    {
        id: "english",
        name: "English Language",
        description: "Grammar, vocabulary and sentence structure.",
        durationMinutes: 15,
        passMark: 50,
        icon: "book"
    },
    {
        id: "physics",
        name: "Physics",
        description: "Mechanics, electricity, light and energy.",
        durationMinutes: 15,
        passMark: 50,
        icon: "atom"
    },
    {
        id: "chemistry",
        name: "Chemistry",
        description: "Atoms, elements, acids and everyday chemistry.",
        durationMinutes: 15,
        passMark: 50,
        icon: "flask"
    }
];


// ---------- Question bank ----------
// Format: [question text, [four options], index of correct option]
// The correct index is NEVER sent to the browser by getExam().
// In the real system, grading happens on the server only.

const BANK = {
    mathematics: [
        ["If 2x + 6 = 14, what is x?", ["2", "3", "4", "5"], 2],
        ["What is 3/4 + 1/6?", ["4/10", "11/12", "3/8", "5/12"], 1],
        ["What is the value of 5² − 3 × 4?", ["13", "8", "22", "17"], 0],
        ["What is 15% of 200?", ["15", "20", "30", "45"], 2],
        ["What is the area of a rectangle 8 cm long and 5 cm wide?", ["13 cm²", "26 cm²", "40 cm²", "80 cm²"], 2],
        ["Which of these is a solution of x² = 49?", ["5", "6", "7", "8"], 2],
        ["What is the sum of the angles in a triangle?", ["90°", "180°", "270°", "360°"], 1],
        ["What is the next number in the sequence 2, 6, 18, 54, ...?", ["108", "162", "148", "72"], 1],
        ["What is the mean of 4, 8, 6, 10 and 12?", ["6", "7", "8", "9"], 2],
        ["Express 0.25 as a fraction in its simplest form.", ["1/2", "1/4", "1/5", "2/5"], 1]
    ],
    english: [
        ["Choose the word closest in meaning to ABUNDANT.", ["Scarce", "Plentiful", "Tiny", "Rare"], 1],
        ["Choose the word opposite in meaning to ANCIENT.", ["Old", "Modern", "Historic", "Aged"], 1],
        ["Complete the sentence: She ___ to school every day.", ["go", "goes", "going", "gone"], 1],
        ["What is the plural of 'child'?", ["Childs", "Childes", "Children", "Childrens"], 2],
        ["Identify the noun: 'The brave soldier fought.'", ["brave", "soldier", "fought", "The"], 1],
        ["Complete the sentence: He is afraid ___ dogs.", ["of", "from", "at", "with"], 0],
        ["What is the past tense of 'write'?", ["Writed", "Wrote", "Written", "Writing"], 1],
        ["A word that describes a verb is called a(n) ...", ["adjective", "noun", "adverb", "pronoun"], 2],
        ["Which of these is spelt correctly?", ["Recieve", "Receive", "Receeve", "Receve"], 1],
        ["'The pen is mightier than the sword' is an example of a ...", ["simile", "onomatopoeia", "proverb", "alliteration"], 2]
    ],
    physics: [
        ["What is the SI unit of force?", ["Joule", "Newton", "Watt", "Pascal"], 1],
        ["Speed is distance divided by ...", ["mass", "time", "force", "area"], 1],
        ["Which of these is a vector quantity?", ["Speed", "Mass", "Velocity", "Time"], 2],
        ["The acceleration due to gravity near the Earth's surface is about ...", ["1.6 m/s²", "9.8 m/s²", "12.5 m/s²", "98 m/s²"], 1],
        ["Which instrument measures electric current?", ["Voltmeter", "Ammeter", "Barometer", "Thermometer"], 1],
        ["Light travels fastest in a ...", ["water", "glass", "vacuum", "oil"], 2],
        ["What is the SI unit of power?", ["Watt", "Newton", "Joule", "Hertz"], 0],
        ["The energy an object has because of its motion is called ...", ["potential energy", "kinetic energy", "thermal energy", "chemical energy"], 1],
        ["According to Ohm's law, voltage V equals ...", ["I ÷ R", "I × R", "R ÷ I", "I + R"], 1],
        ["The bending of light as it passes from one medium to another is called ...", ["reflection", "refraction", "diffraction", "dispersion"], 1]
    ],
    chemistry: [
        ["What is the chemical symbol for sodium?", ["S", "So", "Na", "N"], 2],
        ["The atomic number of an element is the number of its ...", ["neutrons", "protons", "electrons and neutrons", "nucleons"], 1],
        ["What is the chemical formula of water?", ["HO₂", "H₂O", "H₂O₂", "OH"], 1],
        ["What is the pH of a neutral solution at 25 °C?", ["0", "7", "10", "14"], 1],
        ["Which gas supports burning?", ["Nitrogen", "Carbon dioxide", "Oxygen", "Argon"], 2],
        ["Which of these is an alkali metal?", ["Calcium", "Sodium", "Iron", "Copper"], 1],
        ["NaCl is commonly known as ...", ["baking soda", "table salt", "bleach", "vinegar"], 1],
        ["The change of a solid directly into a gas is called ...", ["condensation", "sublimation", "evaporation", "melting"], 1],
        ["Which gas is the most abundant in air?", ["Oxygen", "Nitrogen", "Hydrogen", "Carbon dioxide"], 1],
        ["Acids turn blue litmus paper ...", ["red", "green", "yellow", "colourless"], 0]
    ]
};


// ---------- Seed results so the Results page is not empty ----------

const SEED_RESULTS = [
    {
        id: "seed-1",
        subjectId: "english",
        subjectName: "English Language",
        score: 8,
        total: 10,
        percentage: 80,
        date: "2026-09-28T10:00:00.000Z",
        passed: true
    },
    {
        id: "seed-2",
        subjectId: "physics",
        subjectName: "Physics",
        score: 4,
        total: 10,
        percentage: 40,
        date: "2026-09-30T10:00:00.000Z",
        passed: false
    }
];


function readResults() {
    try {
        const raw = localStorage.getItem(RESULTS_KEY);
        if (raw) return JSON.parse(raw);
        localStorage.setItem(RESULTS_KEY, JSON.stringify(SEED_RESULTS));
    } catch {
        // storage unavailable: fall through to the seed
    }
    return SEED_RESULTS;
}


// ============================================================
// Public functions (these mirror the future endpoints)
// ============================================================

// GET /subjects
export async function getSubjects() {
    await delay();
    return SUBJECTS.map((subject) => ({
        ...subject,
        questionCount: BANK[subject.id].length
    }));
}


// GET /exams/:subjectId  (questions WITHOUT the correct answers)
export async function getExam(subjectId) {
    await delay(400);

    const subject = SUBJECTS.find((s) => s.id === subjectId);

    if (!subject) {
        throw new Error("Subject not found");
    }

    const questions = BANK[subjectId].map(([text, options], index) => ({
        id: `${subjectId}-${index + 1}`,
        text,
        options
    }));

    return {
        subject: { ...subject, questionCount: questions.length },
        questions
    };
}


// POST /exams/:subjectId/submit  { answers: { [questionId]: optionIndex } }
export async function submitExam(subjectId, answers) {
    await delay(700);

    const subject = SUBJECTS.find((s) => s.id === subjectId);

    if (!subject) {
        throw new Error("Subject not found");
    }

    const total = BANK[subjectId].length;

    const score = BANK[subjectId].reduce((count, [, , correct], index) => {
        return answers[`${subjectId}-${index + 1}`] === correct
            ? count + 1
            : count;
    }, 0);

    const percentage = Math.round((score / total) * 100);

    const result = {
        id: `r-${Date.now()}`,
        subjectId,
        subjectName: subject.name,
        score,
        total,
        percentage,
        date: new Date().toISOString(),
        passed: percentage >= subject.passMark
    };

    try {
        localStorage.setItem(
            RESULTS_KEY,
            JSON.stringify([result, ...readResults()])
        );
    } catch {
        // ignore storage errors in the mock
    }

    return result;
}


// GET /results  (newest first)
export async function getResults() {
    await delay(400);

    return [...readResults()].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );
}
