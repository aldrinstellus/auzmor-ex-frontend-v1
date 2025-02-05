import Icon from 'components/Icon';
import ProgressBar from 'components/ProgressBar';
import React, { FC } from 'react';
import { useBackgroundJobStore } from 'stores/backgroundJobStore';

interface IChannelDocSyncJobProps {}

const ChannelDocSyncJob: FC<IChannelDocSyncJobProps> = ({}) => {
  const { jobTitle, reset } = useBackgroundJobStore();

  const showSuccess = jobTitle === 'Sync successful';
  const showFailed = jobTitle === 'Sync failed';
  const showLoading = jobTitle === 'Sync in progress';

  return (
    <div className="flex flex-col bg-neutral-100 rounded-t-9xl px-4 py-3 border-b border-b-neutral-200 gap-2">
      <div className="flex items-center gap-2">
        {showSuccess && (
          <Icon
            name="tickCircleFilled"
            color="!text-green-600"
            hover={false}
            size={20}
          />
        )}
        {showFailed && (
          <Icon
            name="closeCircleFilled"
            color="text-red-500"
            hoverColor="text-red-600"
            className="hover:!text-red-600"
            size={20}
          />
        )}
        <span className="flex-grow font-medium leading-6 text-neutral-900">
          {jobTitle}
        </span>
        {(showSuccess || showFailed) && (
          <Icon name="close2" size={20} onClick={reset} />
        )}
      </div>
      {showLoading && (
        <ProgressBar
          isLoading
          className="flex-grow"
          barClassName="!w-full"
          barFilledClassName="!bg-green-500"
          customLabel={<></>}
        />
      )}
    </div>
  );
};

export default ChannelDocSyncJob;
