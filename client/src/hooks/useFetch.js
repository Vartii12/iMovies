import { useState, useEffect } from "react";
import axios from "axios";

export const BASE_URL = "http://localhost:8000";

const useFetch = (url) => {
  const [resData, setResData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;

    axios
      .get(fullUrl)
      .then((res) => {
        if (isMounted) {
          setResData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { resData, loading, error };
};

export default useFetch;
