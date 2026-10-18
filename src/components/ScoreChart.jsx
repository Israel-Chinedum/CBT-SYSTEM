import { Colors } from "/src/components/Color";

const MAX_BARS = 8;
const PASS_LINE = 50;   // percentage shown as the dashed line

const shortDate = (iso) =>
    new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });


// Simple bar chart built from plain HTML, so no chart library is required.
// `results` is the list returned by getResults() (newest first).
export function ScoreChart({ results }) {

    // Show the latest exams, oldest on the left
    const bars = results.slice(0, MAX_BARS).reverse();

    if (bars.length === 0) return null;

    return (
        <div>

            <div className="relative h-44 flex items-end gap-2 sm:gap-3 border-b border-l border-slate-200 pl-2 pr-1">

                {/* Pass mark line */}
                <div
                    className="absolute left-0 right-0 border-t border-dashed border-slate-300 pointer-events-none"
                    style={{ bottom: `${PASS_LINE}%` }}
                >
                    <span className="absolute right-0 -top-4 text-[10px] text-slate-400">
                        Pass {PASS_LINE}%
                    </span>
                </div>

                {bars.map((r) => {

                    const subject = r.subjectId === "unknown" ? "—" : r.subjectName.slice(0, 3);
                    const height = Math.max(r.percentage, 2);    // keep 0% visible as a thin bar

                    return (
                        <div
                            key={r.id}
                            className="relative flex-1 h-full flex flex-col justify-end items-center"
                            title={`${r.subjectName}: ${r.percentage}% (${shortDate(r.date)})`}
                        >
                            <span className="text-[10px] font-medium text-slate-500 mb-0.5">
                                {r.percentage}%
                            </span>

                            <div
                                className="w-full max-w-[36px] rounded-t-md"
                                style={{
                                    height: `${height}%`,
                                    background: r.passed ? Colors.primary : "#f87171"
                                }}
                                aria-hidden="true"
                            />

                            <span className="absolute -bottom-9 text-[10px] text-slate-500 text-center leading-tight">
                                {subject}
                                <br />
                                {shortDate(r.date)}
                            </span>
                        </div>
                    );
                })}

            </div>

            {/* Space for the labels under the bars, then the legend */}
            <div className="mt-11 flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded" style={{ background: Colors.primary }} />
                    Passed
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-red-400" />
                    Failed
                </span>
            </div>

        </div>
    );
}
