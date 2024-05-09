import { IBranding } from 'contexts/AuthContext';
import { ProductEnum, getProduct } from 'utils/apiService';
import { applyBranding } from 'utils/branding';
import { setItem } from 'utils/persist';
import { create } from 'zustand';

interface IBrandingStore {
  branding: IBranding | null;
  setBranding: (branding: IBranding, isLxp?: boolean) => void;
}

const DEFAULT_OFFICE_BRANDING: IBranding = {
  pageTitle: 'Auzmor Office',
  primaryColor: '#10B981',
  secondaryColor: '#1D4ED8',
  loginConfig: {
    layout: 'RIGHT',
    backgroundType: 'IMAGE',
    color: '#777777',
  },
};

const DEFAULT_LXP_BRANDING: IBranding = {
  pageTitle: 'Auzmor Learn',
  primaryColor: '#ff3366',
  secondaryColor: '#5c5c5c',
  loginConfig: {
    layout: 'RIGHT',
    backgroundType: 'IMAGE',
    color: '#777777',
  },
};

const addDefaultBranding = (branding: IBranding): IBranding => {
  const defaultBranding =
    getProduct() === ProductEnum.Lxp
      ? DEFAULT_LXP_BRANDING
      : DEFAULT_OFFICE_BRANDING;
  return {
    ...branding,
    pageTitle: branding.pageTitle || defaultBranding.pageTitle,
    primaryColor: branding.primaryColor || defaultBranding.primaryColor,
    secondaryColor: branding.secondaryColor || defaultBranding.secondaryColor,
    loginConfig: {
      ...branding.loginConfig,
      layout:
        branding?.loginConfig?.layout || defaultBranding.loginConfig.layout,
      backgroundType:
        branding?.loginConfig?.backgroundType ||
        defaultBranding.loginConfig.backgroundType,
      color: branding?.loginConfig?.color || defaultBranding.loginConfig.color,
    },
  };
};

export const useBrandingStore = create<IBrandingStore>((set) => ({
  branding:
    getProduct() === ProductEnum.Lxp
      ? DEFAULT_LXP_BRANDING
      : DEFAULT_OFFICE_BRANDING,
  setBranding: (branding) => {
    if (!!branding && Object.keys(branding).length > 0) {
      const productBranding = addDefaultBranding(branding);
      applyBranding(productBranding);
      set(() => ({ branding: productBranding }));
      setItem('favicon', productBranding.favicon?.original || '');
      setItem('pageTitle', productBranding.pageTitle || 'Auzmor Office');
    } else {
      try {
        document
          .querySelector('link[rel="icon"]')
          ?.setAttribute('href', '/favicon.ico');
        document.querySelector('title')!.innerText = 'Auzmor Office';
      } catch (e) {}
    }
  },
}));
