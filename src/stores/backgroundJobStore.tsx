import Icon from 'components/Icon';
import Spinner from 'components/Spinner';
import { ReactNode } from 'react';
import { create } from 'zustand';

export enum BackgroundJobStatusEnum {
  YetToStart = 'YET_TO_START',
  Running = 'RUNNING',
  Cancelled = 'CANCELLED',
  Error = 'ERROR',
  CompletedSuccessfully = 'COMPLETED_SUCCESSFULLY',
}

type BackgroundJob = {
  id: string;
  jobData: Record<string, any>;
  progress: number;
  status: BackgroundJobStatusEnum;
  renderer: (
    id: string,
    jobData: Record<string, any>,
    progress: number,
    status: BackgroundJobStatusEnum,
  ) => React.ReactNode;
};

interface IBackgroundJobState {
  show: boolean;
  jobTitle: string;
  progress: number;
  isExpanded: boolean;
  jobs: Record<string, BackgroundJob>;
}

interface IBackgroundJobActions {
  setShow: (flag: boolean) => void;
  setJobTitle: (title: string) => void;
  setProgress: (progress: number) => void;
  setIsExpanded: (flag: boolean) => void;
  setJobs: (jobs: Record<string, BackgroundJob>) => void;
  updateJobProgress: (
    jobId: string,
    progress: number,
    status?: BackgroundJobStatusEnum,
  ) => void;
  getIconFromStatus: (status: BackgroundJobStatusEnum) => ReactNode;
}

export const useBackgroundJobStore = create<
  IBackgroundJobState & IBackgroundJobActions
>((set) => ({
  show: false,
  jobTitle: 'Uploading in progress',
  progress: 75,
  isExpanded: false,
  jobs: {},

  setShow: (flag) => set({ show: flag }),
  setJobTitle: (title) => set({ jobTitle: title }),
  setProgress: (progress) => set({ progress: progress }),
  setIsExpanded: (flag) => set({ isExpanded: flag }),
  setJobs: (jobs) => set({ jobs }),
  updateJobProgress: (jobId, progress, status) =>
    set(({ jobs }) => ({
      jobs: {
        ...jobs,
        [jobId]: {
          ...jobs[jobId],
          progress,
          status: status || jobs[jobId].status,
        },
      },
    })),
  getIconFromStatus: (status) => {
    switch (status) {
      case BackgroundJobStatusEnum.YetToStart:
        return <Spinner className="!w-5 !h-5" />;
      case BackgroundJobStatusEnum.Running:
        return <Spinner className="!w-5 !h-5" />;
      case BackgroundJobStatusEnum.Cancelled:
        return <Icon name="infoCircleFilled" size={20} hover={false} />;
      case BackgroundJobStatusEnum.Error:
        return (
          <Icon
            name="closeCircleFilled"
            color="text-red-500"
            hoverColor="text-red-600"
            className="hover:!text-red-600"
            size={20}
          />
        );
      case BackgroundJobStatusEnum.CompletedSuccessfully:
        return (
          <Icon
            name="tickCircleFilled"
            color="text-primary-600"
            hover={false}
            size={20}
          />
        );
    }
  },
}));
