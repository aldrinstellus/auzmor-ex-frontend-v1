import { StepEnum } from 'pages/Users/components/ImportUsers/utils';
import { create } from 'zustand';

interface IJobStore {
  showJobProgress: boolean;
  setShowJobProgress: (showJobProgress: boolean) => void;
  importId: string;
  setImportId: (importId: string) => void;
  total: number;
  setTotal: (total: number) => void;
  complete: boolean;
  setComplete: (complete: boolean) => void;
  step: StepEnum;
  setStep: (step: StepEnum) => void;
}

export const useJobStore = create<IJobStore>((set) => ({
  showJobProgress: false,
  importId: '',
  setShowJobProgress: (showJobProgress) => set(() => ({ showJobProgress })),
  setImportId: (importId) => set(() => ({ importId })),
  total: 0,
  setTotal: (total) => set({ total }),
  complete: false,
  setComplete: (complete) => set({ complete }),
  step: StepEnum.Upload,
  setStep: (step) => set(() => ({ step })),
}));
