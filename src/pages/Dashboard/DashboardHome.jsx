import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlayCircle } from "lucide-react";
import { Colors } from "/src/components/Color";
import { ScoreChart } from "/src/components/ScoreChart";
import { useAuth } from "/src/context/AuthContext";
import { getSubjects, getResults } from "/src/services/api";
import { getAttempt, userKeyFrom } from "/src/utils/attemptStorage";

const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });


export function DashboardHome() {

    const navigate = useNavigate();
    const { user } = useAuth();
    const userKey = userKeyFrom(user);

    const [subjects, setSubjects] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const firstName =
        (user?.fullname || user?.username || "Student").trim().split(/\s+/)[0];


    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const [subjectList, resultList] = await Promise.all([
                getSubjects(),
                getResults()
            ]);
            setSubjects(subjectList);
            setResults(resultList);
        } catch {
            setError("Could not load your dashboard. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);


    // An exam the student started but has not submitted yet
    const unfinished = subjects.find((s) => getAttempt(userKey, s.id));

    const taken = results.length;
    const passed = results.filter((r) => r.passed).length;
    const average = taken
        ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / taken)
        : 0;

    const stats = [
        { label: "Exams taken", value: taken },
        { label: "Exams passed", value: passed },
        { label: "Average score", value: taken ? `${average}%` : "—" },
        { label: "Subjects available", value: subjects.length }
    ];

    const recent = results.slice(0, 3);


    return (
        <div className="p-6 lg:p-10">

            <h1 className="text-xl lg:text-2xl font-semibold text-slate-800">
                Welcome, {firstName}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
                Here is an overview of your exams.
            </p>


            {/* Error */}
            {error && (
                <div className="mt-6 p-4 rounded-xl bg-red-50 text-red-700 text-sm flex items-center justify-between gap-4">
                    <span>{error}</span>
                    <button onClick={load} className="font-semibold underline shrink-0">
                        Retry
                    </button>
                </div>
            )}


            {/* Unfinished exam banner */}
            {!loading && unfinished && (
                <div
                    className="mt-6 rounded-2xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    style={{ background: Colors.gradient }}
                >
                    <div>
                        <p className="font-semibold">
                            You have an exam in progress
                        </p>
                        <p className="text-sm text-white/80 mt-0.5">
                            {unfinished.name} is waiting for you. The timer is still running.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate(`/exam/${unfinished.id}`)}
                        className="h-10 px-4 rounded-xl bg-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/90 shrink-0"
                        style={{ color: Colors.dark }}
                    >
                        <PlayCircle size={18} />
                        Resume exam
                    </button>
                </div>
            )}


            {/* Stat cards */}
            <div className="mt-6 grid grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((s) => (
                    <div
                        key={s.label}
                        className="rounded-2xl border border-slate-200 bg-white p-5"
                    >
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                            {s.label}
                        </p>
                        <p className="text-2xl font-semibold text-slate-800 mt-2">
                            {loading ? "…" : s.value}
                        </p>
                    </div>
                ))}
            </div>


            {/* Performance chart */}
            {!loading && results.length > 0 && (
                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
                    <h2 className="font-semibold text-slate-800">
                        Performance
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Your latest exam scores
                    </p>

                    <div className="mt-8">
                        <ScoreChart results={results} />
                    </div>
                </div>
            )}


            {/* Recent results */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">

                <div className="flex items-center justify-between gap-4">
                    <h2 className="font-semibold text-slate-800">
                        Recent results
                    </h2>
                    <Link
                        to="/dashboard/results"
                        className="text-sm font-medium underline"
                        style={{ color: Colors.dark }}
                    >
                        View all
                    </Link>
                </div>

                {loading && (
                    <div className="mt-4 h-24 rounded-xl bg-slate-100 animate-pulse" />
                )}

                {!loading && !error && recent.length === 0 && (
                    <p className="mt-4 text-sm text-slate-500">
                        No results yet.{" "}
                        <Link
                            to="/dashboard/subjects"
                            className="font-medium underline"
                            style={{ color: Colors.dark }}
                        >
                            Browse subjects
                        </Link>
                    </p>
                )}

                {!loading && recent.length > 0 && (
                    <ul className="mt-2 divide-y divide-slate-100">
                        {recent.map((r) => (
                            <li
                                key={r.id}
                                className="py-3 flex items-center justify-between gap-4"
                            >
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-slate-800 truncate">
                                        {r.subjectName}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {r.score}/{r.total} · {r.percentage}% · {formatDate(r.date)}
                                    </p>
                                </div>

                                <span
                                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 ${
                                        r.passed
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {r.passed ? "Passed" : "Failed"}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}

            </div>

        </div>
    );
}
