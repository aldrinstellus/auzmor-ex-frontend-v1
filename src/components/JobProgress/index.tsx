/* eslint-disable @typescript-eslint/no-unused-vars */
import Icon from 'components/Icon';
import useModal from 'hooks/useModal';
import usePoller from 'pages/Users/components/ImportUsers/usePoller';
import React, { useEffect, useState } from 'react';
import { useJobStore } from 'stores/jobStore';
import Details from './Details';

const Processing: React.FC = () => {
  const [open, openModal, closeModal] = useModal(false);
  const { importId, setShowJobProgress, complete, setComplete, total } =
    useJobStore();
  const [collapse, openCollpase, closeCollapse] = useModal(true);
  const { ready, data } = usePoller({ importId, action: 'create' });

  useEffect(() => {
    if (ready) {
      setComplete(ready);
    }
  }, [ready]);

  const totalUploaded =
    (data?.result?.data?.info?.addedWithMissingValues || 0) +
    (data?.result?.data?.info?.error || 0) +
    (data?.result?.data?.info?.skipped || 0) +
    (data?.result?.data?.info?.valid || 0);

  const successfullUploads =
    (data?.result?.data?.info?.addedWithMissingValues || 0) +
    (data?.result?.data?.info?.valid || 0);
  const totalRecords = data?.result?.data?.info?.total || total;

  const progress = data?.result?.data?.progress || 0;
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
          <div className="flex space-x-4">
            {!complete && collapse && (
              <div className="flex flex-col justify-end">{progress}%</div>
            )}
            <div className="flex-1">
              <div className="flex justify-between items-center">
                {(() => {
                  if (!complete) {
                    return (
                      <div>
                        Uploading {totalUploaded} out of {totalRecords}{' '}
                        members...
                      </div>
                    );
                  }

                  if (successfullUploads === totalRecords) {
                    return (
                      <div className="v-center space-x-1">
                        <Icon name="boldTick" className="text-primary-500" />
                        <span>All members uploaded successfully</span>
                      </div>
                    );
                  }
                  return (
                    <div className="v-center space-x-1">
                      <Icon name="boldTick" className="text-primary-500" />
                      <span>
                        {successfullUploads} out of {totalRecords} members
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
                  } transition-opacity duration-300 ease-in-out flex items-center gap-4 mt-2.5 mb-2.5`}
                >
                  <div className="w-full rounded-[100px] bg-neutral-400 h-[5px] relative">
                    <div
                      className={`h-full rounded-[100px] bg-primary-500`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
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
