import { useEffect, useRef, useState } from 'react';

const useLocalStorage = (item, defaultValue) => {
  // Preventing useEffect from running twice
  const effectRef = useRef(false);
  const [persist, setPersist] = useState(JSON.parse(localStorage.getItem(item)) || defaultValue);
  useEffect(() => {
    localStorage.setItem(item, JSON.stringify(persist));
    effectRef.current = true;
  }, [item, persist]);
  return [persist, setPersist];
};
export default useLocalStorage;
