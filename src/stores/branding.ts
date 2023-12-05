import { IBranding } from 'contexts/AuthContext';
import { applyBranding } from 'utils/branding';
import { create } from 'zustand';

interface IBrandingStore {
  branding: IBranding | null;
  setBranding: (branding: IBranding) => void;
}

export const useBrandingStore = create<IBrandingStore>((set) => ({
  branding: {
    pageTitle: 'Auzmor Office',
    primaryColor: '#10B981',
    secondaryColor: '#1D4ED8',
    loginConfig: {
      layout: 'RIGHT',
      backgroundType: 'IMAGE',
      color: '#777777',
    },
  },
  setBranding: (branding) => {
    if (!!branding && Object.keys(branding).length > 0) {
      applyBranding(branding);
      set(() => ({ branding }));
    }
  },
}));
