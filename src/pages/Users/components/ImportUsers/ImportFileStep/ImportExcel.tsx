import React, { useEffect } from 'react';
import Spinner from 'components/Spinner';
import usePoller from '../usePoller';
import { StepEnum } from '../utils';
import { useJobStore } from 'stores/jobStore';

type AppProps = {
  open: boolean;
  closeModal: () => any;
  importId: string;
  meta: Record<string, any>;
  setMeta: (...args: any) => any;
};

const ImportingFileStep: React.FC<AppProps> = ({ importId, meta, setMeta }) => {
  const { setStep } = useJobStore();
  const { ready, data } = usePoller({
    importId,
    action: 'parse',
    statusCheck: 'PROCESSING',
  });

  useEffect(() => {
    if (ready) {
      const options = data.result?.data?.info?.sheets?.map((s: any) => ({
        value: s.index,
        label: s.name,
      }));
      setMeta((m: any) => ({
        ...m,
        sheetOptions: options,
        parsedData: data,
      }));
      setStep(StepEnum.SelectSheet);
    }
  }, [ready]);

  return (
    <div className="p-6 flex flex-col items-center justify-center">
      <Spinner className="!h-[100px] !w-[100px]" />
      <div className="text-lg text-neutral-900 font-bold mt-4">
        Importing {meta?.file?.name}
      </div>
    </div>
  );
};

export default ImportingFileStep;
