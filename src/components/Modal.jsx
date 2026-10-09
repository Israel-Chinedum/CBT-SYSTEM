import { useEffect } from "react";

export function Modal({ title, children, actions, onClose }) {

    // Close on Escape
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">

            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
                aria-hidden="true"
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto"
            >
                <h2 className="text-lg font-semibold text-slate-800">
                    {title}
                </h2>

                <div className="mt-3 text-sm text-slate-600">
                    {children}
                </div>

                <div className="mt-6 flex flex-wrap justify-end gap-3">
                    {actions}
                </div>
            </div>

        </div>
    );
}
