import React, { FC, useEffect, useRef } from 'react';
import Header from 'components/ProfileInfo/components/Header';
import Card from 'components/Card';
import PopupMenu from 'components/PopupMenu';
import Icon from 'components/Icon';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { useParams } from 'react-router-dom';
import { DocIntegrationEnum } from 'pages/ChannelDetail/components/Documents';
import Button, { Variant as ButtonVariant, Size } from 'components/Button';
import useModal from 'hooks/useModal';
import EntitySelectModal from 'pages/ChannelDetail/components/Documents/components/EntitySelectModal';
import { useMutation } from '@tanstack/react-query';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import {
  BackgroundJobVariantEnum,
  useBackgroundJobStore,
} from 'stores/backgroundJobStore';
import { getLearnUrl } from 'utils/misc';
import moment from 'moment';
import DocumentPathProvider from 'contexts/DocumentPathContext';
import queryClient from 'utils/queryClient';
import Spinner from 'components/Spinner';
import { useTranslation } from 'react-i18next';

interface IIntegrationSettingProps {}

const IntegrationSetting: FC<IIntegrationSettingProps> = () => {
  const { t } = useTranslation('channelDetail');
  const { getApi } = usePermissions();
  const { channelId } = useParams();
  const [isOpen, openModal, closeModal] = useModal();
  const { config, setConfig, setJobTitle, reset } = useBackgroundJobStore();
  const syncIntervalRef = useRef<any>(null);

  useEffect(
    () => () => {
      if (
        config.variant === BackgroundJobVariantEnum.ChannelDocumentSync &&
        !!config.show &&
        !!syncIntervalRef.current
      ) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
        reset();
      }
    },
    [config.variant],
  );

  const integrationMapping = {
    [DocIntegrationEnum.GoogleDrive]: {
      icon: 'google',
      label: 'Google drive',
    },
    [DocIntegrationEnum.Sharepoint]: {
      icon: 'sharePoint',
      label: t('documentTab.sharepointCTA'),
    },
  };

  const mapIntegrationType: (integration: string) => DocIntegrationEnum = (
    integration,
  ) => {
    switch (integration) {
      case 'SharePoint':
        return DocIntegrationEnum.Sharepoint;
      case 'GoogleDrive':
        return DocIntegrationEnum.GoogleDrive;
      default:
        return DocIntegrationEnum.Sharepoint;
    }
  };

  // Api call: Check connection status
  const useChannelDocumentStatus = getApi(ApiEnum.GetChannelDocumentStatus);
  const { data: statusResponse, refetch } = useChannelDocumentStatus({
    channelId,
  });

  // Api call: Connect site / folder
  const updateConnection = getApi(ApiEnum.UpdateChannelDocumentConnection);
  const updateConnectionMutation = useMutation({
    mutationKey: ['update-channel-connection', channelId],
    mutationFn: updateConnection,
  });

  // Api call: Disconnect site / folder
  const deleteConnection = getApi(ApiEnum.DeleteChannelDocConnection);
  const deleteConnectionMutation = useMutation({
    mutationKey: ['delete-channel-connection', channelId],
    mutationFn: deleteConnection,
    onSettled: () => {
      refetch();
    },
  });

  // API call: Re-sync
  const reSync = getApi(ApiEnum.ChannelDocSync);
  const reSyncMutation = useMutation({
    mutationFn: reSync,
    onMutate: () => {
      handleSyncing();
    },
    onError: () => {
      setJobTitle('Sync failed');
    },
  });

  // API call: get last sync information from this api call
  const useChannelDocSyncStatus = getApi(ApiEnum.UseChannelDocSyncStatus);
  const { data: syncStatus, isLoading } = useChannelDocSyncStatus(
    {
      channelId,
    },
    {
      onSuccess: (data: any) => {
        const syncResults = data?.data?.result?.data;
        if (!!syncResults?.length) {
          const isSynced = !syncResults.some(
            (each: { syncStatus: string }) =>
              each.syncStatus !== 'success' && each.syncStatus !== 'failed',
          );
          if (!isSynced) {
            handleSyncing();
          }
        }
      },
      staleTime: 0,
    },
  );
  const connectedDriveStatus = syncStatus?.data?.result?.data || [];

  const isBaseFolderSet = statusResponse?.status === 'ACTIVE';
  const isConnectionMade =
    isBaseFolderSet ||
    (statusResponse?.status === 'INACTIVE' &&
      statusResponse.availableAccounts.length > 0);
  const integrationType = mapIntegrationType(
    isConnectionMade
      ? statusResponse?.activeAccounts[0]?.platformName
      : statusResponse?.availableAccounts[0],
  );
  const availableAccount = statusResponse?.availableAccounts[0];
  const lastSynced = !isLoading
    ? Math.min(
        ...connectedDriveStatus.map(
          (each: { lastSyncAt: any }) => each.lastSyncAt,
        ),
      )
    : '';

  const popOptions = [
    {
      label: (
        <div className="flex items-center gap-2.5">
          <Icon name="lock-open" size={16} color="text-neutral-900" />
          <span className="font-medium text-xs">
            {t('setting.integrationSetting.disConnect')}
          </span>
        </div>
      ),
      onClick: () => {
        deleteConnectionMutation.mutate({ channelId } as any);
      },
      dataTestId: 'disconnect',
      className: '!px-6 !py-2',
    },
    {
      label: (
        <div className="flex items-center gap-2.5">
          <Icon name="refreshCircle" size={16} color="text-neutral-900" />
          <span className="font-medium text-xs">
            {t('setting.integrationSetting.reSync')}
          </span>
        </div>
      ),
      onClick: () => {
        reSyncMutation.mutate({ channelId } as any);
      },
      dataTestId: 're-sync',
      className: '!px-6 !py-2',
      disabled: (() => !!syncIntervalRef.current)(),
    },
  ].filter((each) => {
    if (
      (each.dataTestId === 'disconnect' || each.dataTestId === 're-sync') &&
      !isBaseFolderSet
    ) {
      return false;
    }
    return true;
  });

  const handleSyncing = () => {
    setJobTitle('Sync in progress');
    setConfig({
      variant: BackgroundJobVariantEnum.ChannelDocumentSync,
      show: true,
      isExpanded: false,
    });
    syncIntervalRef.current = setInterval(async () => {
      const response = await getApi(ApiEnum.GetChannelDocSyncStatus)({
        channelId,
      }).catch(() => {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
        setJobTitle('Sync failed');
      });
      const syncResults = response?.data?.result?.data;
      if (!!syncResults?.length) {
        let successCount = 0;
        let failCount = 0;
        syncResults.forEach((each: { syncStatus: string }) => {
          if (each.syncStatus === 'success') {
            successCount += 1;
          } else if (each.syncStatus === 'failed') {
            failCount += 1;
          }
        });
        if (successCount + failCount === syncResults?.length) {
          clearInterval(syncIntervalRef.current);
          syncIntervalRef.current = null;
          if (successCount === syncResults.length) {
            setJobTitle('Sync successful');
          } else {
            setJobTitle('Sync failed');
          }
        }
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-3">
      <Header
        title={t('setting.integrationSetting.title')}
        dataTestId="integration-settings"
        className="!mb-0"
      />
      <Card shadowOnHover className="flex px-4 py-6 gap-4">
        <div className="flex flex-col gap-1 w-[400px]">
          <div className="flex gap-2.5 items-center">
            <Icon name={integrationMapping[integrationType].icon} size={24} />
            <span className="text-sm text-neutral-500 font-bold">
              {integrationMapping[integrationType].label}
            </span>
            {isConnectionMade && (
              <div className="text-primary-500 font-bold text-xxs bg-primary-50 px-3 py-1 border border-primary-500 rounded-xl">
                {t('setting.integrationSetting.activated')}
              </div>
            )}
          </div>
          <p className="text-xs">
            {t('setting.integrationSetting.description')}
          </p>
        </div>
        <div className="flex flex-col gap-3 flex-grow">
          {isConnectionMade && isBaseFolderSet && lastSynced && (
            <div className="flex gap-2 text-xs text-neutral-700 font-medium items-center">
              {deleteConnectionMutation.isLoading && (
                <Spinner className="!w-4 !h-4" />
              )}{' '}
              {t('setting.integrationSetting.lastSync', {
                date: moment(lastSynced).format('Do MMM YYYY'),
              })}
            </div>
          )}
          <div className="flex gap-6 w-full">
            {isConnectionMade && !isBaseFolderSet && (
              <Button
                label={t('documentTab.selectExistingCTA')}
                variant={ButtonVariant.Secondary}
                size={Size.Small}
                onClick={openModal}
                className="h-9"
              />
            )}
            {!isConnectionMade && (
              <Button
                label={t('setting.integrationSetting.connect')}
                size={Size.Small}
                onClick={() =>
                  window.location.assign(getLearnUrl('/settings/market-place'))
                }
                className="h-9"
              />
            )}
            {integrationType !== DocIntegrationEnum.Sharepoint && (
              <Button
                label={t('addNewPopupBanner')}
                leftIcon="plus"
                size={Size.Small}
                onClick={() => {}}
              />
            )}
          </div>
        </div>
        {!!popOptions.length && (
          <div className="relative">
            <PopupMenu
              triggerNode={
                <div
                  className="cursor-pointer relative"
                  data-testid="feed-post-ellipsis"
                  title="more"
                >
                  <Icon name="moreV2Filled" tabIndex={0} size={16} />
                </div>
              }
              menuItems={popOptions}
              className="right-0 top-6 border-1 border-neutral-200 focus-visible:outline-none w-44"
            />
          </div>
        )}
      </Card>

      {isOpen && (
        <DocumentPathProvider defaultItem={{ id: 'root', label: 'Sites' }}>
          <EntitySelectModal
            isOpen={isOpen}
            closeModal={closeModal}
            onSelect={(entity: any, callback: () => void) =>
              updateConnectionMutation.mutate(
                {
                  channelId: channelId,
                  connections: entity,
                  orgProviderId: availableAccount?.orgProviderId,
                } as any,
                {
                  onSettled: callback,
                  onSuccess: () => {
                    successToastConfig({
                      content: t('documentTab.connectFolder.success'),
                    });
                    refetch();
                    queryClient.invalidateQueries(['get-channel-files'], {
                      exact: false,
                    });
                  },
                  onError: (response: any) => {
                    const failMessage =
                      response?.response?.data?.errors[0]?.reason ===
                      'ACCESS_DENIED'
                        ? t('documentTab.accessDenied')
                        : t('documentTab.connectFolder.failure');
                    failureToastConfig({
                      content: failMessage,
                    });
                  },
                },
              )
            }
            q={{ orgProviderId: availableAccount?.orgProviderId }}
            integrationType={integrationType}
          />
        </DocumentPathProvider>
      )}
    </div>
  );
};

export default IntegrationSetting;
