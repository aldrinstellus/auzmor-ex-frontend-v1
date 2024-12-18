import { clsx } from 'clsx';
import Icon from 'components/Icon';
import ProgressBar from 'components/ProgressBar';
import React, { FC, Fragment, useEffect, useState } from 'react';
import {
  BackgroundJobStatusEnum,
  useBackgroundJobStore,
} from 'stores/backgroundJobStore';
import './progressbarStyle.css';

interface IindexProps {}

const BackgroundJob: FC<IindexProps> = ({}) => {
  const [right, setRight] = useState<number>(2);
  const [showProgressbar, setShowProgressbar] = useState(true);
  const {
    isExpanded,
    jobTitle,
    progress,
    jobs,
    setJobTitle,
    setProgress,
    jobsRenderer,
    setIsExpanded,
    reset,
  } = useBackgroundJobStore();

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

  useEffect(() => {
    let progress = 0;
    let total = 0;
    const jobKeys = Object.keys(jobs);
    jobKeys.forEach((key) => {
      progress += jobs[key].progress;
      total += 100;
    });
    if (total === 0) {
      setProgress(total);
    } else {
      setProgress(Math.floor((progress * 100) / total));
    }
    setJobTitle(
      `Uploading ${Math.floor(progress / 100)} out of ${Math.floor(
        total / 100,
      )} files`,
    );

    if (Math.floor((progress * 100) / total) === 100) {
      let success = 0;
      let totalItems = 0;
      jobKeys.forEach((key) => {
        if (
          jobs[key].status === BackgroundJobStatusEnum.CompletedSuccessfully
        ) {
          success += 1;
        }
        totalItems += 1;
      });
      setShowProgressbar(false);
      setJobTitle(`${success} out of ${totalItems} uploads completed`);
    }
  }, [jobs]);

  const style = clsx({
    'fixed flex flex-col bottom-0 z-[999] w-[420px] transition-all duration-300 rounded-t-9xl border border-neutral-300 bg-white':
      true,
  });

  const contentStyle = clsx({
    'flex flex-col gap-4 w-full overflow-y-auto px-4 h-0 transition-all duration-300':
      true,
    '!h-[168px] py-3': isExpanded,
  });

  return (
    <div
      className={style}
      style={{
        right,
        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
      }}
    >
      <div className="flex flex-col bg-neutral-100 rounded-t-9xl px-4 py-3 border-b border-b-neutral-200">
        <div className="flex items-center gap-2">
          <span className="flex-grow font-medium leading-6 text-neutral-900">
            {jobTitle}
          </span>
          <Icon
            name="arrowDown"
            size={24}
            onClick={() => setIsExpanded(!isExpanded)}
            className={clsx({ 'rotate-0': isExpanded, '-rotate-180': true })}
          />
          <Icon name="close" size={20} onClick={reset} />
        </div>
        {showProgressbar && (
          <div className="flex items-center gap-4">
            <span className="text-neutral-900 font-medium">{progress}%</span>
            <ProgressBar
              completed={progress}
              total={100}
              className="flex-grow"
              barClassName="!w-full"
              barFilledClassName="!bg-primary-500"
              customLabel={<></>}
            />
          </div>
        )}
      </div>
      <div className={contentStyle}>
        {jobsRenderer
          ? jobsRenderer(Object.keys(jobs).map((key) => jobs[key]))
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
    </div>
  );
};

export default BackgroundJob;
