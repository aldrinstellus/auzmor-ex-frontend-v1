import Icon from 'components/Icon';
import React, { FC } from 'react';
import { useBackgroundJobStore } from 'stores/backgroundJobStore';

interface IChannelDocSyncJobProps {}

const ChannelDocSyncJob: FC<IChannelDocSyncJobProps> = ({}) => {
  const { jobTitle, reset } = useBackgroundJobStore();
  return (
    <div className="flex flex-col bg-neutral-100 rounded-t-9xl px-4 py-3 border-b border-b-neutral-200">
      <div className="flex items-center gap-2">
        <span className="flex-grow font-medium leading-6 text-neutral-900">
          {jobTitle}
        </span>
        <Icon name="close" size={20} onClick={reset} />
      </div>
    </div>
  );
};

export default ChannelDocSyncJob;
