import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Colors } from "/src/components/Color";
import { ResultSlip } from "/src/components/ResultSlip";
import { getResults } from "/src/services/api";

const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });


function StatusBadge({ passed }) {
    return (
        <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                passed
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
            }`}
        >
            {passed ? "Passed" : "Failed"}
        </span>
    );
}


export function ResultsPage() {

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [slip, setSlip] = useState(null);     // the result being printed


    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            setResults(await getResults());
        } catch {
            setError("Could not load your results. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);


    const taken = results.length;
    const passed = results.filter((r) => r.passed).length;
    const average = taken
        ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / taken)
        : 0;

    const stats = [
        { label: "Exams taken", value: taken },
        { label: "Exams passed", value: passed },
        { label: "Average score", value: taken ? `${average}%` : "—" }
    ];


    return (
        <div className="p-6 lg:p-10">

            <h1 className="text-xl lg:text-2xl font-semibold text-slate-800">
                My Results
            </h1>
            <p className="text-sm text-slate-500 mt-1">
                Your scores from every exam you have taken.
            </p>


            {/* Summary cards */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
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


            {/* Error */}
            {error && (
                <div className="mt-6 p-4 rounded-xl bg-red-50 text-red-700 text-sm flex items-center justify-between gap-4">
                    <span>{error}</span>
                    <button onClick={load} className="font-semibold underline shrink-0">
                        Retry
                    </button>
                </div>
            )}


            {/* Loading */}
            {loading && (
                <div className="mt-6 h-40 rounded-2xl bg-white border border-slate-200 animate-pulse" />
            )}


            {/* Empty */}
            {!loading && !error && taken === 0 && (
                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center">
                    <p className="text-slate-600 text-sm">
                        You have not taken any exams yet.
                    </p>
                    <Link
                        to="/dashboard/subjects"
                        className="inline-block mt-3 text-sm font-semibold underline"
                        style={{ color: Colors.dark }}
                    >
                        Go to subjects
                    </Link>
                </div>
            )}


            {/* Desktop table */}
            {!loading && taken > 0 && (
                <div className="hidden md:block mt-6 rounded-2xl border border-slate-200 bg-white overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">
                            <tr>
                                <th className="px-5 py-3 font-medium">Subject</th>
                                <th className="px-5 py-3 font-medium">Score</th>
                                <th className="px-5 py-3 font-medium">Percentage</th>
                                <th className="px-5 py-3 font-medium">Date</th>
                                <th className="px-5 py-3 font-medium">Status</th>
                                <th className="px-5 py-3 font-medium">Slip</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {results.map((r) => (
                                <tr key={r.id}>
                                    <td className="px-5 py-3.5 font-medium text-slate-800">
                                        {r.subjectName}
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-600">
                                        {r.score}/{r.total}
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-600">
                                        {r.percentage}%
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-600">
                                        {formatDate(r.date)}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <StatusBadge passed={r.passed} />
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <button
                                            onClick={() => setSlip(r)}
                                            className="text-sm font-medium underline"
                                            style={{ color: Colors.dark }}
                                        >
                                            Print
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}


            {/* Mobile cards */}
            {!loading && taken > 0 && (
                <div className="md:hidden mt-6 space-y-3">
                    {results.map((r) => (
                        <div
                            key={r.id}
                            className="rounded-2xl border border-slate-200 bg-white p-4"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <p className="font-medium text-slate-800">
                                    {r.subjectName}
                                </p>
                                <StatusBadge passed={r.passed} />
                            </div>
                            <p className="text-sm text-slate-600 mt-2">
                                {r.score}/{r.total} · {r.percentage}%
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                {formatDate(r.date)}
                            </p>
                            <button
                                onClick={() => setSlip(r)}
                                className="mt-3 text-sm font-medium underline"
                                style={{ color: Colors.dark }}
                            >
                                Print result slip
                            </button>
                        </div>
                    ))}
                </div>
            )}


            {slip && (
                <ResultSlip result={slip} onClose={() => setSlip(null)} />
            )}

        </div>
    );
}
