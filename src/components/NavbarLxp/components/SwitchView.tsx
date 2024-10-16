import { usePermissions } from 'hooks/usePermissions';
import { useState } from 'react';
import { ApiEnum } from '../../../utils/permissions/enums/apiEnum';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { FRONTEND_VIEWS } from 'interfaces';
import clsx from 'clsx';

export const SwitchView = ({ viewType }: { viewType: FRONTEND_VIEWS }) => {
  const { getApi } = usePermissions();
  const { t } = useTranslation('navbar', { keyPrefix: 'learn' });
  const [activeView, setActiveView] = useState(
    viewType || FRONTEND_VIEWS.classic,
  );
  const toggleView = getApi(ApiEnum.ToggleView);
  const toggleViewMutation = useMutation({
    mutationKey: ['user-toggle-view'],
    mutationFn: (payload: { viewType: string }) => toggleView(payload.viewType),
    onError: (error) => console.log(error),
    onSuccess: async () => {
      setTimeout(() => window.location.reload(), 1000);
    },
  });

  const handleUpdateView = (viewType: FRONTEND_VIEWS) => {
    if (viewType === activeView) return;
    setActiveView(viewType);
    toggleViewMutation.mutate({ viewType: viewType.toUpperCase() });
  };

  const buttonStyle = (active: boolean) =>
    clsx({
      'text-[12.5px] h-6 flex items-center justify-center pt-[4.5px] pb-[3.5px] px-2.5 ':
        true,
      ' border-none rounded-full outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary-500':
        true,
      'transition-all duration-[0.15s] ease-[ease]': true,
      'text-neutral-900 bg-transparent cursor-pointer': !active,
      'text-white bg-primary-500 cursor-default': active,
    });

  return (
    <div className="flex items-center py-[17px] px-[6px] h-[33px] rounded-full bg-primary-200">
      <button
        className={buttonStyle(activeView === FRONTEND_VIEWS.classic)}
        onClick={() => handleUpdateView(FRONTEND_VIEWS.classic)}
        tabIndex={0}
        onKeyUp={(e) => {
          if (e.keyCode === 13) handleUpdateView(FRONTEND_VIEWS.classic);
        }}
      >
        {t('classic')}
      </button>
      <button
        className={buttonStyle(activeView === FRONTEND_VIEWS.modern)}
        onClick={() => handleUpdateView(FRONTEND_VIEWS.modern)}
        tabIndex={0}
        onKeyUp={(e) => {
          if (e.keyCode === 13) handleUpdateView(FRONTEND_VIEWS.modern);
        }}
      >
        {t('modern')}
      </button>
    </div>
  );
};
