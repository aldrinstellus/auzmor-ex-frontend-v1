import { JobTypesEnum, getJobStep, startJobStep } from 'queries/job';
import { ReactNode } from 'react';
import { create } from 'zustand';

interface IJobStore {
  progress: number;
  heading: string;
  showJobProgress: boolean;
  content: null | ReactNode;
  setProgress: (progress: number) => void;
  setHeading: (heading: string) => void;
  setShowJobProgress: (showJobProgress: boolean) => void;
  setContent: (content: null | ReactNode) => void;
  bulkUserInsert: (jobId: string) => Promise<any>;
  pollInterval: ReturnType<typeof setInterval> | null;
}

export const useJobStore = create<IJobStore>((set) => ({
  progress: 0,
  heading: '',
  showJobProgress: false,
  content: null,
  setProgress: (progress) => set(() => ({ progress })),
  setHeading: (heading) => set(() => ({ heading })),
  setShowJobProgress: (showJobProgress) => set(() => ({ showJobProgress })),
  setContent: (content) => set(() => ({ content })),
  bulkUserInsert: async (jobId) => {
    set(() => ({
      progress: 0,
      heading: 'Uploading...',
      showJobProgress: true,
      content: null,
    }));
    const response = await startJobStep(jobId, {
      type: JobTypesEnum.UserCreation,
    });
    if (response) {
      const progressData = response.result.data;
      set(() => ({
        progress: progressData.progress,
        heading: `Uploading ${progressData.info.valid} out of ${progressData.info.total} members...`,
        showJobProgress: true,
        content: null,
        pollInterval: setInterval(async () => {
          const progressData = await getJobStep(jobId, {
            type: JobTypesEnum.UserCreation,
          });
          console.log(progressData);
        }, 200),
      }));
    }
  },
  pollInterval: null,
}));
