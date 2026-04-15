import { useEffect, useState } from 'react';

export function useDelayedFlag(flag: boolean, delayMs = 180): boolean {
  const [delayedFlag, setDelayedFlag] = useState(false);

  useEffect(() => {
    if (!flag) {
      setDelayedFlag(false);
      return;
    }

    const timeout = window.setTimeout(() => {
      setDelayedFlag(true);
    }, delayMs);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [flag, delayMs]);

  return delayedFlag;
}
