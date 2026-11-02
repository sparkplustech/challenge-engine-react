import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

function readStoredValue<T>(key: string, initialValue: T): T {
  try {
    const storedValue = window.localStorage.getItem(key)
    return storedValue === null ? initialValue : JSON.parse(storedValue) as T
  } catch {
    return initialValue
  }
}

export default function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => readStoredValue(key, initialValue))

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage can be unavailable or full; keep the in-memory state usable.
    }
  }, [key, value])

  return [value, setValue]
}
