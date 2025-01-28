import { clsx } from 'clsx';
import React, { FC, useEffect, useMemo, useState } from 'react';
import {
  BackgroundJobVariantEnum,
  useBackgroundJobStore,
} from 'stores/backgroundJobStore';
import './progressbarStyle.css';
import ChannelDocUploadJob from './ChannelDocUploadJob';
import ChannelDocSyncJob from './ChannelDocSyncJob';

interface IindexProps {}

const BackgroundJob: FC<IindexProps> = ({}) => {
  const [right, setRight] = useState<number>(2);
  const { config } = useBackgroundJobStore();

  useEffect(() => {
    try {
      const refElem = document.getElementsByClassName('app-container')[0];
      setRight(
        (window.innerWidth - refElem.getBoundingClientRect().width) / 2 + 2,
      );
    } catch (_e) {
      setRight(2);
    }
  }, []);

  const style = clsx({
    'fixed flex flex-col bottom-0 z-[999] w-[420px] transition-all duration-300 rounded-t-9xl border border-neutral-300 bg-white':
      true,
  });

  const Job: any = useMemo(() => {
    switch (config.variant) {
      case BackgroundJobVariantEnum.ChannelDocumentUpload:
        return ChannelDocUploadJob;
      case BackgroundJobVariantEnum.ChannelDocumentSync:
        return ChannelDocSyncJob;
      default:
        return <></>;
    }
  }, [config]);

  return (
    <div
      className={style}
      style={{
        right,
        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
      }}
    >
      <Job />
    </div>
  );
};

export default BackgroundJob;
