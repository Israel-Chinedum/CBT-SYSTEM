import { createContext, useCallback, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "cbt_auth";

const AuthContext = createContext(null);

// Read the saved session once, when the app first loads.
// Wrapped in try/catch because storage can be blocked or hold bad data.
function readStoredSession() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {

    const [session, setSession] = useState(readStoredSession);


    // Call this after a successful login response.
    const login = useCallback((user, token) => {

        const nextSession = { user: user ?? null, token: token ?? null };

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
        } catch {
            // Storage unavailable: the session still works until refresh.
        }

        setSession(nextSession);
    }, []);


    // Clears everything so protected pages lock again.
    const logout = useCallback(() => {

        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {
            // Ignore storage errors on logout.
        }

        setSession(null);
    }, []);


    const value = useMemo(
        () => ({
            user: session?.user ?? null,
            token: session?.token ?? null,
            isAuthenticated: Boolean(session),
            login,
            logout
        }),
        [session, login, logout]
    );


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside <AuthProvider>.");
    }

    return context;
}
