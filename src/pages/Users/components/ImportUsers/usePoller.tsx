/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import apiService from 'utils/apiService';

interface IPoller {
  importId: string;
  action: string;
  enabled?: boolean;
  statusCheck?: string;
}

const usePoller = ({
  importId,
  action,
  enabled = true,
  statusCheck = 'COMPLETED',
}: IPoller) => {
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
    if (status === statusCheck || status === 'COMPLETED') {
      setLoading(false);
      readyRef.current = true;
      clearInterval(intervalId);
    }
  };

  useEffect(() => {
    let ts: any = null;
    // callFn();
    if (enabled) {
      // callFn();
      ts = setInterval(() => callFn(), 5000);
      setIntervalId(ts);
    }
    return () => clearInterval(ts);
  }, [enabled]);

  return { loading, ready: readyRef.current, data };
};

export default usePoller;
