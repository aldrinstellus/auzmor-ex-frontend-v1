/* eslint-disable @typescript-eslint/no-unused-vars */
import Icon from 'components/Icon';
import useModal from 'hooks/useModal';
import usePoller from 'pages/Users/components/ImportUsers/usePoller';
import React, { useEffect, useState } from 'react';
import { useJobStore } from 'stores/jobStore';
import Details from './Details';

const Processing: React.FC = () => {
  const [open, openModal, closeModal] = useModal(false);
  const { importId, total, setShowJobProgress, complete, setComplete } =
    useJobStore();
  const [collapse, openCollpase, closeCollapse] = useModal(true);
  const { ready, data } = usePoller(importId, 'create');

  useEffect(() => {
    if (ready) {
      setComplete(ready);
    }
  }, [ready]);

  return (
    <div className="fixed w-full bottom-0 flex justify-center px-14 z-50">
      <div
        className="w-[1440px] flex flex-row-reverse"
        data-testid="progressbar"
      >
        <div
          className={`${
            complete ? 'h-auto' : collapse ? 'h-[74px]' : 'h-[50px]'
          } px-4 py-3 bg-neutral-900 rounded-t-9xl border border-neutral-300 w-[600px] transition-all duration-300 ease-in-out font-medium text-base text-white origin-top scale-y-100`}
        >
          <div className="flex justify-between items-center">
            {(() => {
              if (!complete) {
                return (
                  <div className="px-10">
                    Uploading {data?.result?.data?.info?.total} out of {total}{' '}
                    memebers...
                  </div>
                );
              }
              if (data?.result?.data?.info?.total === total) {
                return (
                  <div className="px-10 v-center space-x-1">
                    <Icon name="boldTick" className="text-primary-500" />
                    <span>All members uploaded successfully</span>
                  </div>
                );
              }
              return (
                <div className="v-center space-x-1">
                  <Icon name="boldTick" className="text-primary-500" />
                  <span>
                    {data?.result?.data?.info?.total} out of {total} memebers
                    uploaded successfully
                  </span>
                </div>
              );
            })()}

            <div className="flex gap-2 items-center">
              {complete ? (
                <div
                  className="text-sm cursor-pointer"
                  onClick={openModal}
                  data-testid="viewdetails-progressbar"
                >
                  View Details
                </div>
              ) : (
                <Icon
                  name={!collapse ? 'arrowUp' : 'arrowDown'}
                  onClick={collapse ? closeCollapse : openCollpase}
                  hoverColor="text-white"
                  color="!text-white"
                  size={24}
                  dataTestId="expand-collapse-progressbar"
                />
              )}
              <Icon
                name="close"
                onClick={() => setShowJobProgress(false)}
                hoverColor="text-white"
                color="!text-white"
                size={20}
              />
            </div>
          </div>
          {!complete && (
            <div
              className={`${
                collapse ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-300 ease-in-out flex items-center gap-4 mt-[2px]`}
            >
              <div>{data.progress}%</div>
              <div className="w-full rounded-[100px] bg-neutral-400 h-[5px] relative">
                <div
                  className={`h-full rounded-[100px] bg-primary-500`}
                  style={{ width: `${data.progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
      {open && (
        <Details
          open={open}
          closeModal={closeModal}
          data={data}
          importId={importId}
        />
      )}
    </div>
  );
};

export default Processing;
