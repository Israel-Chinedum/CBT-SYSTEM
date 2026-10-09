// Saves an in-progress exam in the browser so that a refresh or a
// dropped connection does not lose answers or reset the timer.
// The timer stores the absolute END time, not "minutes left".

const keyFor = (userKey, subjectId) => `cbt_attempt_${userKey}_${subjectId}`;


// Different students on the same computer get different keys
export function userKeyFrom(user) {
    return String(user?.id ?? user?.email ?? user?.username ?? "guest");
}


export function getAttempt(userKey, subjectId) {
    try {
        const raw = localStorage.getItem(keyFor(userKey, subjectId));
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}


export function saveAttempt(userKey, subjectId, attempt) {
    try {
        localStorage.setItem(
            keyFor(userKey, subjectId),
            JSON.stringify(attempt)
        );
    } catch {
        // storage unavailable: exam still works until refresh
    }
}


export function clearAttempt(userKey, subjectId) {
    try {
        localStorage.removeItem(keyFor(userKey, subjectId));
    } catch {
        // ignore
    }
}
