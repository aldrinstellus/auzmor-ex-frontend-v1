import { clsx } from 'clsx';
import Icon from 'components/Icon';
import ProgressBar from 'components/ProgressBar';
import React, { FC, Fragment, useEffect, useState } from 'react';
import { useBackgroundJobStore } from 'stores/backgroundJobStore';

interface IindexProps {}

const BackgroundJob: FC<IindexProps> = ({}) => {
  const [right, setRight] = useState<number>(2);
  const { isExpanded, jobTitle, progress, jobs, jobsRenderer, setIsExpanded } =
    useBackgroundJobStore();

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
    'fixed flex flex-col bottom-0 z-[999] w-[420px] transition-all h-[72px] duration-300 rounded-t-9xl border border-neutral-300 bg-white':
      true,
    '!h-[240px]': isExpanded,
  });

  const contentStyle = clsx({
    'flex flex-col gap-4 w-full h-[168px] overflow-y-auto px-4 py-3': true,
  });

  console.log(jobs);

  return (
    <div
      className={style}
      style={{
        right,
        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
      }}
    >
      <div className="flex flex-col bg-neutral-100 rounded-t-9xl px-4 py-3 border-b border-b-neutral-200">
        <div className="flex items-center gap-2 ml-12">
          <span className="flex-grow font-medium leading-6 text-neutral-900">
            {jobTitle}
          </span>
          <Icon
            name="arrowDown"
            size={24}
            onClick={() => setIsExpanded(!isExpanded)}
            className={clsx({ 'rotate-0': isExpanded, '-rotate-180': true })}
          />
          <Icon name="close" size={20} />
        </div>
        <div className="flex items-center gap-4">
          <span>{progress}%</span>
          <ProgressBar
            completed={progress}
            total={100}
            className="flex-grow"
            barClassName="!w-full"
            barFilledClassName="!bg-primary-500"
            customLabel={<></>}
          />
        </div>
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
