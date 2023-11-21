import { IBranding } from 'contexts/AuthContext';
import { applyBranding } from 'utils/branding';
import { create } from 'zustand';

interface IBrandingStore {
  branding: IBranding | null;
  setBranding: (branding: IBranding) => void;
}

export const useBrandingStore = create<IBrandingStore>((set) => ({
  branding: null,
  setBranding: (branding) => {
    applyBranding(branding);
    set(() => ({ branding }));
  },
}));
