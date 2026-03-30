import { useCallback, useEffect, useState } from "react";

type SetState<T> = (value: T | ((prev: T) => T)) => void;

export function useLocalStorageState<T>(key: string, initialValue: T): [T, SetState<T>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? initialValue : (JSON.parse(raw) as T);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage write errors (private mode, quota, etc.)
    }
  }, [key, value]);

  const set: SetState<T> = useCallback((next) => {
    setValue((prev) => (typeof next === "function" ? (next as (p: T) => T)(prev) : next));
  }, []);

  return [value, set];
}

