import { useCallback, useState } from "react";

export const useLocalStorage = (keyName: string, defaultValue = "") => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(keyName);
      if (value) {
        return JSON.parse(value);
      } else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (error) {
      console.log(error);
      return defaultValue;
    }
  });
  const setValue = useCallback(
    (newValue: unknown) => {
      try {
        window.localStorage.setItem(keyName, JSON.stringify(newValue));
      } catch (err) {
        console.log(err);
      }
      setStoredValue(newValue);
    },
    [setStoredValue, keyName]
  );
  return [storedValue, setValue];
};
