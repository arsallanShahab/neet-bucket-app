import { useEffect, useState } from "react";

export const useFetch = (queryOptions) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (isFetched) return;

    const fetchData = async () => {
      try {
        const res = await fetch(queryOptions.url, queryOptions.options);
        if (isMounted) {
          const json = await res.json();
          setData(json);
          setLoading(false);
          setIsFetched(true);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setLoading(false);
          setIsFetched(true);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Prevent updating state on an unmounted component
    };
  }, [queryOptions, isFetched]);

  return { data, loading, error };
};
