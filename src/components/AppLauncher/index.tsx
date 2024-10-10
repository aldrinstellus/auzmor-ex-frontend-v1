import { useParams } from 'react-router-dom';
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

import { useAppStore } from 'stores/appStore';

import { isFiltersEmpty } from 'utils/misc';
import { useTranslation } from 'react-i18next';
import { useShouldRender } from 'hooks/useShouldRender';
import useNavigate from 'hooks/useNavigation';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';
import useProduct from 'hooks/useProduct';

const ID = 'AppLauncher';

const AppLauncher = () => {
  const { t } = useTranslation('appLauncher');
  const shouldRender = useShouldRender(ID);
  if (!shouldRender) {
    return <></>;
  }
  const { getApi } = usePermissions();
  const navigate = useNavigate();
  const { isAdmin, isLearner } = useRole();
  const { isLxp } = useProduct();
  const widgetApps = useAppStore((state) => state.widgetApps);
  const [open, openCollpase, closeCollapse] = useModal(true, false);
  const [openAddApp, openAddAppModal, closeAddAppModal] = useModal();
  const { channelId } = useParams();
  const useInfiniteWidgetApps = getApi(ApiEnum.GetWidgetApps);
  const { data, isLoading } = useInfiniteWidgetApps(
    isFiltersEmpty(
      !channelId
        ? {
            limit: 3,
          }
        : { limit: 3, channelIds: channelId },
    ),
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
        onKeyUp={(e) => (e.code === 'Enter' ? toggleModal() : '')}
        tabIndex={0}
        title="app launcher"
        aria-expanded={open}
        role="button"
      >
        <p className="font-bold">{t('title')}</p>
        <div className="flex items-center gap-2">
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
                  {[...Array(3)].map((_value, index) => (
                    <div
                      className="flex flex-col gap-2"
                      key={`${index}-app-widget-skeleton`}
                    >
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
                <ul className="flex items-center gap-8 w-full">
                  {appIds?.map(({ id }: any) => (
                    <li key={id}>
                      <AppWidgetCard data={widgetApps[id]} />
                    </li>
                  ))}
                </ul>
                <Button
                  variant={Variant.Secondary}
                  size={Size.Small}
                  className="py-[7px]"
                  label={t('view-All-CTA')}
                  dataTestId="app-launcher-view-all"
                  onClick={() => {
                    if (isLxp) {
                      navigate(isLearner ? '/apps?myApp=true' : '/apps');
                    } else {
                      navigate(isAdmin ? '/apps?myApp=true' : '/apps');
                    }
                  }}
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
