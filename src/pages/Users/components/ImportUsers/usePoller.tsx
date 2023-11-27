/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';

const usePoller = (stepId: number) => {
  const [loading, setLoading] = useState();

  return { loading };
};

export default usePoller;
