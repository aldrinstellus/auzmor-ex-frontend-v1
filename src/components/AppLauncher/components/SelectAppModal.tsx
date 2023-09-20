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

import { App, useInfiniteApps } from 'queries/apps';
import { useAppStore } from 'stores/appStore';

interface ISelectAppModalProps {
  open: boolean;
  closeModal: () => void;
  widgetApps?: App[];
}

const SelectAppModal: FC<ISelectAppModalProps> = ({
  open,
  closeModal,
  widgetApps,
}) => {
  const { ref, inView } = useInView();
  const { apps } = useAppStore();
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteApps({});
  const [selectedApps, setSelectedApps] = useState<App[]>(widgetApps || []);

  const appIds = data?.pages.flatMap((page: any) => {
    return page.data?.result?.data.map((apps: any) => {
      try {
        return apps;
      } catch (e) {
        console.log('Error', { apps });
      }
    });
  }) as { id: string }[];

  const onSelect = (isSelected: boolean, app: App) => {
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
        title="Select apps"
        onClose={() => closeModal()}
        closeBtnDataTestId="app-launcher-select-app-close"
      />

      <div className="flex flex-col w-full max-h-[400px] p-6 gap-6 overflow-y-auto">
        {(isLoading || (appIds || []).length > 0) && (
          <div className="font-bold">Choose apps for widget (upto 3)</div>
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
              <div className="flex flex-wrap gap-6">
                {appIds
                  ?.filter(({ id }: any) => !!apps[id])
                  ?.map(({ id }: any) => (
                    <AppCard
                      data={apps[id]}
                      key={id}
                      isSelected={!!find(selectedApps, apps[id])}
                      onSelect={onSelect}
                      disabled={!find(selectedApps, apps[id]) && maxAppSelected}
                    />
                  ))}
              </div>
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
                  No Apps found to be selected
                </div>
              </div>
              <div className="flex space-x-1 text-xs font-normal text-neutral-500">
                There is no app found in your organization right now.
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
          label="Back"
          variant={Variant.Secondary}
          onClick={closeModal}
          className="mr-4"
          dataTestId="app-launcher-select-app-back"
        />
        <Button
          label="Select"
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
