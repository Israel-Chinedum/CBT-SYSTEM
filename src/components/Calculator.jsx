import { useState } from "react";
import { Calculator as CalculatorIcon, X } from "lucide-react";
import { Colors } from "/src/components/Color";

// Rounds away tiny floating point noise (0.1 + 0.2 -> 0.3)
const format = (value) => String(parseFloat(value.toPrecision(12)));

function compute(a, b, op) {
    if (op === "+") return a + b;
    if (op === "−") return a - b;
    if (op === "×") return a * b;
    if (op === "÷") return b === 0 ? NaN : a / b;
    return b;
}

// Layout of the keypad (4 columns)
const KEYS = [
    ["C", "⌫", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "−"],
    ["1", "2", "3", "+"],
    ["±", "0", ".", "="],
    ["√", "x²", "1/x", "π"]
];


export function Calculator() {

    const [open, setOpen] = useState(false);
    const [display, setDisplay] = useState("0");
    const [prev, setPrev] = useState(null);       // number typed before the operator
    const [op, setOp] = useState(null);
    const [overwrite, setOverwrite] = useState(false);

    const isError = display === "Error";

    const reset = () => {
        setDisplay("0");
        setPrev(null);
        setOp(null);
        setOverwrite(false);
    };

    const showResult = (value) => {
        if (!Number.isFinite(value)) {
            setDisplay("Error");
        } else {
            setDisplay(format(value));
        }
        setOverwrite(true);
    };

    const pressDigit = (digit) => {
        if (isError || overwrite) {
            setDisplay(digit);
            setOverwrite(false);
            return;
        }
        if (display.replace(/[-.]/g, "").length >= 14) return;
        setDisplay(display === "0" ? digit : display + digit);
    };

    const pressDot = () => {
        if (isError || overwrite) {
            setDisplay("0.");
            setOverwrite(false);
            return;
        }
        if (!display.includes(".")) setDisplay(display + ".");
    };

    const pressOperator = (nextOp) => {
        if (isError) return;
        const current = parseFloat(display);

        // Chain: 2 + 3 + ... calculates 2 + 3 first
        if (prev !== null && op && !overwrite) {
            const result = compute(prev, current, op);
            if (!Number.isFinite(result)) {
                reset();
                setDisplay("Error");
                return;
            }
            setPrev(result);
            setDisplay(format(result));
        } else {
            setPrev(current);
        }

        setOp(nextOp);
        setOverwrite(true);
    };

    const pressEquals = () => {
        if (isError || prev === null || !op) return;
        const result = compute(prev, parseFloat(display), op);
        setPrev(null);
        setOp(null);
        showResult(result);
    };

    const pressKey = (key) => {
        if (/^[0-9]$/.test(key)) return pressDigit(key);

        switch (key) {
            case ".":
                return pressDot();
            case "+":
            case "−":
            case "×":
            case "÷":
                return pressOperator(key);
            case "=":
                return pressEquals();
            case "C":
                return reset();
            case "⌫":
                if (isError || overwrite) return reset();
                return setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
            case "±":
                if (isError || display === "0") return;
                return setDisplay(display.startsWith("-") ? display.slice(1) : "-" + display);
            case "%":
                if (isError) return;
                return showResult(parseFloat(display) / 100);
            case "√":
                if (isError) return;
                return showResult(Math.sqrt(parseFloat(display)));
            case "x²":
                if (isError) return;
                return showResult(parseFloat(display) ** 2);
            case "1/x":
                if (isError) return;
                return showResult(1 / parseFloat(display));
            case "π":
                setDisplay(format(Math.PI));
                return setOverwrite(true);
            default:
                return undefined;
        }
    };

    const isOperator = (key) => ["+", "−", "×", "÷"].includes(key);


    return (
        <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3">

            {open && (
                <div
                    className="w-64 rounded-2xl bg-white border border-slate-200 shadow-xl p-3"
                    role="dialog"
                    aria-label="Calculator"
                >

                    <div className="flex items-center justify-between px-1 pb-2">
                        <p className="text-sm font-semibold text-slate-700">
                            Calculator
                        </p>
                        <button
                            onClick={() => setOpen(false)}
                            aria-label="Close calculator"
                            className="p-1 rounded-md text-slate-500 hover:bg-slate-100"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Display */}
                    <div
                        className="rounded-xl px-3 py-2 text-right text-white"
                        style={{ background: Colors.darker }}
                    >
                        <p className="h-4 text-[11px] text-white/60 truncate">
                            {prev !== null && op ? `${format(prev)} ${op}` : ""}
                        </p>
                        <p className="text-2xl font-mono font-semibold truncate">
                            {display}
                        </p>
                    </div>

                    {/* Keys */}
                    <div className="mt-3 grid grid-cols-4 gap-2">
                        {KEYS.flat().map((key) => (
                            <button
                                key={key}
                                onClick={() => pressKey(key)}
                                className={`h-10 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 ${
                                    key === "="
                                        ? "text-white"
                                        : isOperator(key)
                                        ? "text-white"
                                        : "bg-slate-100 text-slate-800"
                                }`}
                                style={
                                    key === "="
                                        ? { background: Colors.gradient }
                                        : isOperator(key)
                                        ? { background: Colors.primary }
                                        : undefined
                                }
                            >
                                {key}
                            </button>
                        ))}
                    </div>

                </div>
            )}

            <button
                onClick={() => setOpen((o) => !o)}
                aria-label={open ? "Hide calculator" : "Show calculator"}
                aria-expanded={open}
                className="h-12 w-12 rounded-full text-white shadow-lg flex items-center justify-center hover:opacity-90"
                style={{ background: Colors.gradient }}
            >
                <CalculatorIcon size={20} />
            </button>

        </div>
    );
}
