import { useNavigate } from 'react-router-dom';
import { memo } from 'react';
import Skeleton from 'react-loading-skeleton';

import Card from 'components/Card';
import Icon from 'components/Icon';
import Button, { Size, Variant } from 'components/Button';
import AppWidgetCard from './components/AppWidgetCard';
import SelectAppModal from './components/SelectAppModal';
import EmptyState from './components/EmptyState';
import AppLauncherSkeleton from './components/AppLauncherSkeleton';

import useModal from 'hooks/useModal';
import useRole from 'hooks/useRole';

import { useInfiniteWidgetApps } from 'queries/apps';
import { useAppStore } from 'stores/appStore';

import { isFiltersEmpty } from 'utils/misc';
import { useTranslation } from 'react-i18next';

const AppLauncher = () => {
  const { t } = useTranslation('appLauncher');
  const navigate = useNavigate();
  const { isAdmin } = useRole();
  const widgetApps = useAppStore((state) => state.widgetApps);
  const [open, openCollpase, closeCollapse] = useModal(true, false);
  const [openAddApp, openAddAppModal, closeAddAppModal] = useModal();
  const { data, isLoading } = useInfiniteWidgetApps(
    isFiltersEmpty({
      limit: 3,
    }),
  );

  const appIds = data?.pages.flatMap((page: any) => {
    return page.data?.result?.data.map((apps: any) => {
      try {
        return apps;
      } catch (e) {
        console.log('Error', { apps });
      }
    });
  }) as { id: string }[];

  const toggleModal = () => {
    if (open) closeCollapse();
    else openCollpase();
  };

  if (isLoading && !isAdmin) return <AppLauncherSkeleton />;

  if ((appIds || []).length === 0 && !isAdmin) return <></>;

  return (
    <Card className="py-6 flex flex-col rounded-9xl" shadowOnHover>
      <div
        className="px-6 flex items-center justify-between cursor-pointer"
        data-testid="app-launcher"
        onClick={toggleModal}
      >
        <div className="font-bold">{t('title')}</div>
        <div className="flex items-center gap-2">
          {/* {(appIds || []).length > 0 && isAdmin && (
            <Icon
              name="edit"
              size={20}
              color="text-neutral-900"
              dataTestId="app-launcher-collapse"
              onClick={(e) => {
                e.stopPropagation();
                openAddAppModal();
              }}
            />
          )} */}
          <Icon
            name={open ? 'arrowUp' : 'arrowDown'}
            size={20}
            color="text-neutral-900"
            dataTestId="app-launcher-collapse"
          />
        </div>
      </div>
      <div
        className={`transition-max-h px-6 duration-300 ease-in-out overflow-hidden ${
          open ? 'max-h-[500px] mt-4' : 'max-h-[0]'
        }`}
      >
        {(() => {
          if (isLoading) {
            return (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-8 w-full">
                  {[...Array(3)].map((element) => (
                    <div className="flex flex-col gap-2" key={element}>
                      <Skeleton
                        className="!h-[60px] !w-[60px]"
                        borderRadius={12}
                      />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-9" borderRadius={32} />
              </div>
            );
          }
          if (appIds.length > 0) {
            return (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-8 w-full">
                  {appIds?.map(({ id }: any) => (
                    <AppWidgetCard data={widgetApps[id]} key={id} />
                  ))}
                </div>
                <Button
                  variant={Variant.Secondary}
                  size={Size.Small}
                  className="py-[7px]"
                  label={t('view-All-CTA')}
                  dataTestId="app-launcher-view-all"
                  onClick={() =>
                    navigate(isAdmin ? '/apps?tab=myApps' : '/apps')
                  }
                />
              </div>
            );
          }
          return <EmptyState openModal={openAddAppModal} />;
        })()}
      </div>

      {openAddApp && (
        <SelectAppModal
          open={openAddApp}
          closeModal={closeAddAppModal}
          widgetApps={appIds?.map(({ id }: any) => widgetApps[id])}
        />
      )}
    </Card>
  );
};

export default memo(AppLauncher);
