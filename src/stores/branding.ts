import { IBranding } from 'contexts/AuthContext';
import { applyBranding } from 'utils/branding';
import { setItem } from 'utils/persist';
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
      setItem('favicon', branding.favicon?.original || '');
    } else {
      try {
        document
          .querySelector('link[rel="icon"]')
          ?.setAttribute('href', '/favicon.ico');
      } catch (e) {}
    }
  },
}));
