import { useEffect } from "react";
import { Printer } from "lucide-react";
import { Colors } from "/src/components/Color";
import { useAuth } from "/src/context/AuthContext";

const formatDateTime = (iso) =>
    new Date(iso).toLocaleString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });


// Print rules: when printing, hide the whole page except the slip
const PRINT_CSS = `
@media print {
    body * { visibility: hidden !important; }
    #result-slip, #result-slip * { visibility: visible !important; }
    #result-slip {
        position: fixed !important;
        left: 0; top: 0;
        width: 100%;
        max-width: 100% !important;
        margin: 0 !important;
        border: none !important;
        box-shadow: none !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }
}
`;


export function ResultSlip({ result, passMark = 50, onClose }) {

    const { user } = useAuth();

    // Close on Escape
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    const rows = [
        ["Student", user?.fullname || user?.username || "—"],
        ["Email", user?.email || "—"],
        ["Subject", result.subjectName],
        ["Date taken", formatDateTime(result.date)],
        ["Score", `${result.score} / ${result.total}`],
        ["Percentage", `${result.percentage}%`],
        ["Pass mark", `${passMark}%`]
    ];

    return (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-black/50 p-4">

            <style>{PRINT_CSS}</style>

            <div className="min-h-full flex flex-col items-center justify-center gap-4">

                {/* The slip itself (this is what gets printed) */}
                <div
                    id="result-slip"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Result slip"
                    className="w-full max-w-md bg-white rounded-2xl border border-slate-200 overflow-hidden"
                >

                    <div
                        className="px-6 py-5 text-white text-center"
                        style={{ background: Colors.gradient }}
                    >
                        <p className="text-lg font-semibold tracking-tight">
                            CBT-SYSTEM
                        </p>
                        <p className="text-sm text-white/80">
                            Examination Result Slip
                        </p>
                    </div>

                    <dl className="px-6 py-5 divide-y divide-slate-100">
                        {rows.map(([label, value]) => (
                            <div
                                key={label}
                                className="py-2.5 flex items-center justify-between gap-4 text-sm"
                            >
                                <dt className="text-slate-500">{label}</dt>
                                <dd className="font-medium text-slate-800 text-right">
                                    {value}
                                </dd>
                            </div>
                        ))}
                    </dl>

                    <div className="px-6 pb-6">
                        <div
                            className={`rounded-xl py-3 text-center text-lg font-semibold ${
                                result.passed
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {result.passed ? "PASSED" : "FAILED"}
                        </div>

                        <p className="mt-4 text-center text-xs text-slate-400">
                            Printed on {formatDateTime(new Date().toISOString())}
                        </p>
                    </div>

                </div>


                {/* Buttons (hidden when printing, because they are outside the slip) */}
                <div className="flex gap-3">
                    <button
                        onClick={() => window.print()}
                        className="h-11 px-5 rounded-xl text-sm font-medium text-white flex items-center gap-2 hover:opacity-90"
                        style={{ background: Colors.gradient }}
                    >
                        <Printer size={18} />
                        Print / Save as PDF
                    </button>

                    <button
                        onClick={onClose}
                        className="h-11 px-5 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
}
