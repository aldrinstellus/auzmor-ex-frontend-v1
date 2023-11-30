/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import apiService from 'utils/apiService';

const usePoller = (importId: string, action: string) => {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});

  const [intervalId, setIntervalId] = useState<any>(null);

  const callFn = async () => {
    if (ready) {
      clearInterval(intervalId);
      return;
    }
    const { data } = await apiService.get(
      `/users/import/${importId}/${action}`,
    );

    setData(data);
    let status = '';
    if (action === 'validate') {
      status = data.result.data.status;
    } else {
      status = data.status;
    }

    if (status === 'COMPLETED') {
      setLoading(false);
      setReady(true);
      clearInterval(intervalId);
    }
  };

  useEffect(() => {
    callFn();
    const ts = setInterval(() => callFn(), 5000);
    setIntervalId(ts);
    return () => clearInterval(ts);
  }, []);

  return { loading, ready, data };
};

export default usePoller;
