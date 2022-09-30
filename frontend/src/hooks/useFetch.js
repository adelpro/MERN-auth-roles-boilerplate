import { useState, useEffect } from "react";

const useFetch = (url, method) => {
  const [isloading, setIsloading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          // error coming back from server
          throw Error(res.json());
        }
        return res.json();
      })
      .then((data) => {
        setIsloading(false);
        setData(data);
        setError(null);
      })
      .catch((err) => {
        setIsloading(false);
        setError(err.message);
      });
    return () => controller.abort();
  }, [url]);
  return { data, isloading, error };
};
export default useFetch;
