import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calculator, BookOpen, Atom, FlaskConical, Clock, ListChecks } from "lucide-react";
import { Colors } from "/src/components/Color";
import { Modal } from "/src/components/Modal";
import { useAuth } from "/src/context/AuthContext";
import { getSubjects } from "/src/services/api";
import { getAttempt, userKeyFrom } from "/src/utils/attemptStorage";

// The server sends an icon NAME; we map it to a real icon here
const ICONS = {
    calculator: Calculator,
    book: BookOpen,
    atom: Atom,
    flask: FlaskConical
};

const RULES = [
    "The timer starts as soon as you begin and cannot be paused.",
    "Your answers are saved automatically, so a refresh will not lose them.",
    "The exam is submitted automatically when time runs out.",
    "You can move between questions and flag any you want to review."
];


export function SubjectsPage() {

    const navigate = useNavigate();
    const { user } = useAuth();
    const userKey = userKeyFrom(user);

    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selected, setSelected] = useState(null);

    const gradientStyle = { background: Colors.gradient };


    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            setSubjects(await getSubjects());
        } catch {
            setError("Could not load subjects. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);


    // An unfinished attempt exists for this student and subject
    const hasAttempt = (subjectId) => Boolean(getAttempt(userKey, subjectId));

    const handleClick = (subject) => {
        if (hasAttempt(subject.id)) {
            navigate(`/exam/${subject.id}`);
        } else {
            setSelected(subject);
        }
    };


    return (
        <div className="p-6 lg:p-10">

            <h1 className="text-xl lg:text-2xl font-semibold text-slate-800">
                Subjects
            </h1>
            <p className="text-sm text-slate-500 mt-1">
                Choose a subject to begin your exam.
            </p>


            {/* Error */}
            {error && (
                <div className="mt-6 p-4 rounded-xl bg-red-50 text-red-700 text-sm flex items-center justify-between gap-4">
                    <span>{error}</span>
                    <button
                        onClick={load}
                        className="font-semibold underline shrink-0"
                    >
                        Retry
                    </button>
                </div>
            )}


            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                {/* Loading skeletons */}
                {loading &&
                    [0, 1, 2, 3].map((n) => (
                        <div
                            key={n}
                            className="h-64 rounded-2xl bg-white border border-slate-200 animate-pulse"
                        />
                    ))}


                {!loading &&
                    subjects.map((subject) => {

                        const Icon = ICONS[subject.icon] ?? BookOpen;
                        const resuming = hasAttempt(subject.id);

                        return (
                            <div
                                key={subject.id}
                                className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col"
                            >

                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                                    style={gradientStyle}
                                >
                                    <Icon size={22} />
                                </div>

                                <h2 className="mt-4 font-semibold text-slate-800">
                                    {subject.name}
                                </h2>

                                <p className="text-[13px] text-slate-500 mt-1 flex-1">
                                    {subject.description}
                                </p>

                                <div className="mt-4 space-y-1.5 text-[13px] text-slate-600">
                                    <p className="flex items-center gap-2">
                                        <Clock size={15} className="text-slate-400" />
                                        {subject.durationMinutes} minutes
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <ListChecks size={15} className="text-slate-400" />
                                        {subject.questionCount} questions
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleClick(subject)}
                                    className="mt-5 w-full h-10 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity"
                                    style={gradientStyle}
                                >
                                    {resuming ? "Resume Exam" : "Start Exam"}
                                </button>

                            </div>
                        );
                    })}

            </div>


            {/* Confirmation before starting */}
            {selected && (
                <Modal
                    title={`Start ${selected.name}?`}
                    onClose={() => setSelected(null)}
                    actions={
                        <>
                            <button
                                onClick={() => setSelected(null)}
                                className="h-10 px-4 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => navigate(`/exam/${selected.id}`)}
                                className="h-10 px-4 rounded-xl text-sm font-medium text-white hover:opacity-90"
                                style={gradientStyle}
                            >
                                Begin Exam
                            </button>
                        </>
                    }
                >
                    <p className="font-medium text-slate-700">
                        {selected.durationMinutes} minutes · {selected.questionCount} questions · pass mark {selected.passMark}%
                    </p>

                    <ul className="mt-3 list-disc pl-5 space-y-1.5">
                        {RULES.map((rule) => (
                            <li key={rule}>{rule}</li>
                        ))}
                    </ul>
                </Modal>
            )}

        </div>
    );
}
