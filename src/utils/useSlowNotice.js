import { useEffect, useState } from "react";

// Returns true once `active` has stayed true for longer than `delayMs`.
// Used to show "the server is waking up" when a request takes too long.
export function useSlowNotice(active, delayMs = 6000) {

    const [slow, setSlow] = useState(false);

    useEffect(() => {

        if (!active) {
            setSlow(false);
            return;
        }

        const timer = setTimeout(() => setSlow(true), delayMs);

        return () => clearTimeout(timer);
    }, [active, delayMs]);

    return slow;
}
