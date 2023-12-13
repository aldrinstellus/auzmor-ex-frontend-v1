import Spinner from 'components/Spinner';
import React, { useEffect } from 'react';
import usePoller from './usePoller';
import { StepEnum } from './utils';

type AppProps = {
  importId: string;
  fileName: string;
  setMeta: (...args: any) => any;
  setStep: (...args: any) => any;
};

const ImportingForExcel: React.FC<AppProps> = ({
  importId,
  fileName,
  setStep,
  setMeta,
}) => {
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
        Importing {fileName}
      </div>
    </div>
  );
};

export default ImportingForExcel;
