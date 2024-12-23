import Icon from 'components/Icon';
import Spinner from 'components/Spinner';
import { ReactNode } from 'react';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
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
  jobComment: string;
  renderer: (
    id: string,
    jobData: Record<string, any>,
    progress: number,
    status: BackgroundJobStatusEnum,
    jobComment: string,
  ) => React.ReactNode;
};

export enum BackgroundJobVariantEnum {
  ChannelDocumentUpload = 'CHANNEL_DOCUMENT_UPLOAD',
  ChannelDocumentSync = 'CHANNEL_DOCUMENT_SYNC',
}

interface IBackgroundJobState {
  variant: BackgroundJobVariantEnum;
  show: boolean;
  jobTitle: string;
  progress: number;
  isExpanded: boolean;
  jobs: Record<string, BackgroundJob>;
  jobsRenderer?: (jobs: BackgroundJob[]) => ReactNode;
}

interface IBackgroundJobActions {
  setVariant: (variant: BackgroundJobVariantEnum) => void;
  setShow: (flag: boolean) => void;
  setJobTitle: (title: string) => void;
  setProgress: (progress: number) => void;
  setIsExpanded: (flag: boolean) => void;
  setJobs: (jobs: Record<string, BackgroundJob>) => void;
  setJobsRenderer: (renderer: (jobs: BackgroundJob[]) => ReactNode) => void;
  getJob: (jobId: string) => BackgroundJob;
  updateJob: (job: BackgroundJob) => void;
  updateJobProgress: (
    jobId: string,
    progress: number,
    status?: BackgroundJobStatusEnum,
  ) => void;
  getIconFromStatus: (
    status: BackgroundJobStatusEnum,
    progress: number,
  ) => ReactNode;
  reset: () => void;
}

export const useBackgroundJobStore = create<
  IBackgroundJobState & IBackgroundJobActions
>((set, get) => ({
  variant: BackgroundJobVariantEnum.ChannelDocumentUpload,
  show: false,
  jobTitle: 'Uploading in progress',
  progress: 75,
  isExpanded: true,
  jobs: {},

  setVariant: (variant) => set({ variant }),
  setShow: (flag) => set({ show: flag }),
  setJobTitle: (title) => set({ jobTitle: title }),
  setProgress: (progress) => set({ progress: progress }),
  setIsExpanded: (flag) => set({ isExpanded: flag }),
  setJobs: (jobs) => set({ jobs }),
  setJobsRenderer: (renderer) => set({ jobsRenderer: renderer }),
  getJob: (jobId) => get().jobs[jobId],
  updateJob: (job) => set(({ jobs }) => ({ jobs: { ...jobs, [job.id]: job } })),
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
  getIconFromStatus: (status, progress) => {
    switch (status) {
      case BackgroundJobStatusEnum.YetToStart:
        return <Spinner className="!w-5 !h-5" />;
      case BackgroundJobStatusEnum.Running:
        return (
          <div className="flex items-center justify-center w-5 h-5">
            <CircularProgressbar
              value={progress}
              strokeWidth={10}
              styles={buildStyles({
                pathTransitionDuration: 0.15,
              })}
            />
          </div>
        );
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
  reset: () =>
    set({
      variant: BackgroundJobVariantEnum.ChannelDocumentUpload,
      show: false,
      jobTitle: '',
      progress: 0,
      isExpanded: true,
      jobs: {},
      jobsRenderer: undefined,
    }),
}));
