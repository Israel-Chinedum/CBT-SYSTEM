import { Link } from "react-router-dom";
import { Colors } from "/src/components/Color";

export function NotFoundPage() {

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
            style={{ background: Colors.background }}
        >

            <p
                className="text-7xl font-bold"
                style={{ color: Colors.dark }}
            >
                404
            </p>

            <h1 className="mt-3 text-xl font-semibold text-slate-800">
                Page not found
            </h1>

            <p className="mt-2 text-sm text-slate-600 max-w-sm">
                The page you are looking for does not exist or may have been moved.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                    to="/dashboard"
                    className="h-11 px-5 rounded-xl flex items-center justify-center text-sm font-medium text-white hover:opacity-90"
                    style={{ background: Colors.gradient }}
                >
                    Go to dashboard
                </Link>

                <Link
                    to="/"
                    className="h-11 px-5 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                    Back to home
                </Link>
            </div>

        </div>
    );
}
