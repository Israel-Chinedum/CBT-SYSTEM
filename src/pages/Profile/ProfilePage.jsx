import { useNavigate } from "react-router-dom";
import { LogOut, Lock } from "lucide-react";
import { Colors } from "/src/components/Color";
import { useAuth } from "/src/context/AuthContext";

function initials(name) {
    if (!name) return "?";
    return name
        .trim()
        .split(/\s+/)
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}


export function ProfilePage() {

    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Adjust these field names to match what the server returns
    const fullname = user?.fullname || "";
    const username = user?.username || "";
    const email = user?.email || "";
    const phone = user?.phone || "";
    const studentId = user?.studentId || "";

    const gradientStyle = { background: Colors.gradient };

    const details = [
        { label: "Full name", value: fullname },
        { label: "Username", value: username },
        { label: "Email", value: email },
        { label: "Phone number", value: phone }
    ];

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };


    return (
        <div className="p-6 lg:p-10 max-w-3xl">

            <h1 className="text-xl lg:text-2xl font-semibold text-slate-800">
                Profile
            </h1>


            {/* Identity card */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 flex items-center gap-4">

                <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white text-lg font-semibold shrink-0"
                    style={gradientStyle}
                >
                    {initials(fullname || username)}
                </div>

                <div className="min-w-0">
                    <p className="font-semibold text-slate-800 truncate">
                        {fullname || username || "Student"}
                    </p>
                    {studentId && (
                        <p className="text-sm text-slate-500 truncate">
                            {studentId}
                        </p>
                    )}
                </div>

            </div>


            {/* Personal information */}
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">

                <h2 className="font-semibold text-slate-800">
                    Personal information
                </h2>

                <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    {details.map((d) => (
                        <div key={d.label} className="min-w-0">
                            <dt className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                                {d.label}
                            </dt>
                            <dd className="mt-1 text-sm text-slate-800 truncate">
                                {d.value || "—"}
                            </dd>
                        </div>
                    ))}
                </dl>

            </div>


            {/* Account settings */}
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">

                <h2 className="font-semibold text-slate-800">
                    Account settings
                </h2>

                <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <Lock size={18} className="text-slate-400 shrink-0" />
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-800">
                                Change password
                            </p>
                            <p className="text-xs text-slate-500">
                                Coming soon
                            </p>
                        </div>
                    </div>

                    <button
                        disabled
                        className="h-9 px-4 rounded-lg border border-slate-200 text-sm text-slate-400 cursor-not-allowed shrink-0"
                    >
                        Change
                    </button>
                </div>

            </div>


            {/* Logout */}
            <button
                onClick={handleLogout}
                className="mt-6 w-full sm:w-auto h-11 px-6 rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                style={gradientStyle}
            >
                <LogOut size={18} />
                Logout
            </button>

        </div>
    );
}
