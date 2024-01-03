/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import ImportCsv from './ImportCsv';
import ImportExcel from './ImportExcel';
import Modal from 'components/Modal';
import { parseImport } from 'queries/importUsers';
import { useMutation } from '@tanstack/react-query';
import Spinner from 'components/Spinner';

type AppProps = {
  open: boolean;
  closeModal: () => any;
  importId: string;
  meta: Record<string, any>;
  setMeta: (...args: any) => any;
};

const ImportingFileStep: React.FC<AppProps> = (props) => {
  const isCsv = props.meta?.file?.name?.includes('.csv');
  const [loading, setLoading] = useState(true);

  const parseMutation = useMutation(() => parseImport(props.importId), {
    onSuccess: () => {
      props.setMeta((m: any) => ({ ...m, parsed: true }));
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  useEffect(() => {
    if (!props.meta.parsed) {
      parseMutation.mutate();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <Modal open={props.open} className="max-w-2xl">
      {(() => {
        if (loading) {
          return (
            <div className="p-6 flex flex-col items-center justify-center">
              <Spinner className="!h-[100px] !w-[100px]" />
              <div className="text-lg text-neutral-900 font-bold mt-4">
                Importing {props.meta?.file?.name}
              </div>
            </div>
          );
        }
        if (isCsv) {
          return <ImportCsv {...props} />;
        }
        return <ImportExcel {...props} />;
      })()}
    </Modal>
  );
};

export default ImportingFileStep;
