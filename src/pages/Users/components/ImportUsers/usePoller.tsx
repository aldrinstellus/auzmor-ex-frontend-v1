/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import apiService from 'utils/apiService';

const usePoller = (importId: string, action: string) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});
  const readyRef = useRef(false);

  const [intervalId, setIntervalId] = useState<any>(null);

  const callFn = async () => {
    if (readyRef.current) {
      clearInterval(intervalId);
      return;
    }
    const { data } = await apiService.get(
      `/users/import/${importId}/${action}`,
    );

    setData(data);
    const status = data.result.data.status;
    if (status === 'COMPLETED') {
      setLoading(false);
      readyRef.current = true;
      clearInterval(intervalId);
    }
  };

  useEffect(() => {
    callFn();
    const ts = setInterval(() => callFn(), 5000);
    setIntervalId(ts);
    return () => clearInterval(ts);
  }, []);

  return { loading, ready: readyRef.current, data };
};

export default usePoller;
