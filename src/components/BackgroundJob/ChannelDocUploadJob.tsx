import { clsx } from 'clsx';
import Icon from 'components/Icon';
import ProgressBar from 'components/ProgressBar';
import React, { FC, Fragment, useEffect, useState } from 'react';
import {
  BackgroundJobStatusEnum,
  useBackgroundJobStore,
} from 'stores/backgroundJobStore';

interface IChannelDocUploadJobProps {}

const ChannelDocUploadJob: FC<IChannelDocUploadJobProps> = ({}) => {
  const [showProgressbar, setShowProgressbar] = useState(true);
  const {
    config,
    jobTitle,
    progress,
    jobs,
    setJobTitle,
    setProgress,
    setIsExpanded,
    reset,
  } = useBackgroundJobStore();

  useEffect(() => {
    let progress = 0;
    let total = 0;
    const jobKeys = Object.keys(jobs);
    jobKeys.forEach((key) => {
      progress += jobs[key].progress || 0;
      total += 100;
    });
    if (total === 0) {
      setProgress(total);
    } else {
      setProgress(Math.floor((progress * 100) / total));
    }
    const completed = progress / 100;
    const pending = Math.floor((total - progress) / 100);
    const failed = jobKeys.filter(
      (key) => jobs[key].status === BackgroundJobStatusEnum.Error,
    ).length;

    console.log({ jobs });
    const completedText = completed > 0 ? `${completed} completed` : null;
    const failedText = failed > 0 ? `${failed} failed` : null;
    const pendingText = pending > 0 ? `${pending} pending` : null;

    const jobTitleText = [completedText, failedText, pendingText]
      .filter(Boolean)
      .join(', ');
    console.log({ jobTitleText });
    setJobTitle(jobTitleText);

    if (Math.floor((progress * 100) / total) === 100) {
      setIsExpanded(false);
      setShowProgressbar(false);
    }
  }, [jobs]);

  const contentStyle = clsx({
    'flex flex-col w-full overflow-y-auto px-4 transition-all duration-300 !max-h-[168px]':
      true,
    'h-0': !config.isExpanded,
  });

  return (
    <Fragment>
      <div className="flex flex-col bg-neutral-100 rounded-t-9xl px-4 py-3 border-b border-b-neutral-200">
        <div className="flex items-center gap-2">
          <span className="flex-grow font-medium leading-6 text-neutral-900">
            {jobTitle}
          </span>
          <Icon
            name="arrowDown"
            size={24}
            onClick={() => setIsExpanded(!config.isExpanded)}
            className={clsx({
              'rotate-0': config.isExpanded,
              '-rotate-180': true,
            })}
          />
          {progress === 100 && <Icon name="close2" size={20} onClick={reset} />}
        </div>
        {showProgressbar && (
          <div className="flex items-center gap-4">
            <span className="text-neutral-900 font-medium">{progress}%</span>
            <ProgressBar
              completed={progress}
              total={100}
              className="flex-grow"
              barClassName="!w-full"
              barFilledClassName="!bg-green-500"
              customLabel={<></>}
            />
          </div>
        )}
      </div>
      <div className={contentStyle}>
        {config.jobsRenderer
          ? config.jobsRenderer(Object.keys(jobs).map((key) => jobs[key]))
          : Object.keys(jobs).map((key) => (
              <Fragment key={key}>
                {jobs[key].renderer(
                  jobs[key].id,
                  jobs[key].jobData,
                  jobs[key].progress,
                  jobs[key].status,
                  jobs[key].jobComment,
                )}
              </Fragment>
            ))}
      </div>
    </Fragment>
  );
};

export default ChannelDocUploadJob;
