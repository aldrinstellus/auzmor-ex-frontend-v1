import { useEffect, useState, FC } from 'react';
import find from 'lodash/find';
import Skeleton from 'react-loading-skeleton';
import { useInView } from 'react-intersection-observer';

import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import Button, { Variant } from 'components/Button';
import PageLoader from 'components/PageLoader';
import AppCard from './AppCard';
import TeamNotFound from 'images/TeamNotFound.svg';

import { IApp } from 'interfaces';
import { useAppStore } from 'stores/appStore';
import { useTranslation } from 'react-i18next';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';

interface ISelectAppModalProps {
  open: boolean;
  closeModal: () => void;
  widgetApps?: IApp[];
}

const SelectAppModal: FC<ISelectAppModalProps> = ({
  open,
  closeModal,
  widgetApps,
}) => {
  const { t } = useTranslation('appLauncher', {
    keyPrefix: 'select-app-modal',
  });
  const { ref, inView } = useInView();
  const { getApi } = usePermissions();
  const { apps } = useAppStore();
  const useInfiniteApps = getApi(ApiEnum.GetApps);
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteApps({});
  const [selectedApps, setSelectedApps] = useState<IApp[]>(widgetApps || []);

  const appIds = data?.pages.flatMap((page: any) => {
    return page.data?.result?.data.map((apps: any) => {
      try {
        return apps;
      } catch (e) {
        console.log('Error', { apps });
      }
    });
  }) as { id: string }[];

  const onSelect = (isSelected: boolean, app: IApp) => {
    if (isSelected) {
      setSelectedApps((prevApps) =>
        prevApps.filter((_app) => _app.id !== app.id),
      );
    } else {
      setSelectedApps((prevApps) => [...prevApps, app]);
    }
  };

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const maxAppSelected = selectedApps.length === 3;

  return (
    <Modal open={open} closeModal={closeModal} className="max-w-[638px]">
      <Header
        title={t('title')}
        onClose={() => closeModal()}
        closeBtnDataTestId="app-launcher-select-app-close"
      />

      <div className="flex flex-col w-full max-h-[400px] p-6 gap-6 overflow-y-auto">
        {(isLoading || (appIds || []).length > 0) && (
          <div className="font-bold">{t('choose-app')}</div>
        )}

        {(() => {
          if (isLoading) {
            return (
              <div className="flex flex-wrap gap-6">
                {[...Array(12)].map((element) => (
                  <Skeleton
                    className="!w-[128px] !h-[75px]"
                    borderRadius={8}
                    key={element}
                  />
                ))}
              </div>
            );
          }
          if (appIds.length > 0) {
            return (
              <ul className="flex flex-wrap gap-6">
                {appIds
                  ?.filter(({ id }: any) => !!apps[id])
                  ?.map(({ id }: any) => (
                    <li key={id}>
                      <AppCard
                        data={apps[id]}
                        isSelected={!!find(selectedApps, apps[id])}
                        onSelect={onSelect}
                        disabled={
                          !find(selectedApps, apps[id]) && maxAppSelected
                        }
                      />
                    </li>
                  ))}
              </ul>
            );
          }
          return (
            <div className="flex flex-col space-y-3 items-center w-full">
              <div className="flex flex-col space-y-6 items-center">
                <img
                  src={TeamNotFound}
                  alt="Apps Not Found"
                  height={140}
                  width={165}
                />
                <div className="text-lg font-bold" data-testid="no-app-found">
                  {t('not-found')}
                </div>
              </div>
              <div className="flex space-x-1 text-xs font-normal text-neutral-500">
                {t('not-found-org')}{' '}
              </div>
            </div>
          );
        })()}
        <div className="h-12 w-12">
          {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
        </div>
        {isFetchingNextPage && <PageLoader />}
      </div>

      {/* Footer */}
      <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
        <Button
          label={t('back-CTA')}
          variant={Variant.Secondary}
          onClick={closeModal}
          className="mr-4"
          dataTestId="app-launcher-select-app-back"
        />
        <Button
          label={t('select-CTA')}
          variant={Variant.Primary}
          // onClick={handleSubmit(onSubmit)}
          dataTestId="app-launcher-select-cta"
          disabled={selectedApps.length === 0}
        />
      </div>
    </Modal>
  );
};

export default SelectAppModal;
