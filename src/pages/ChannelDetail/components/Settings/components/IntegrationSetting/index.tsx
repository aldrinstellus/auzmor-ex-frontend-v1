import React, { FC } from 'react';
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

interface IIntegrationSettingProps {
  canEdit: boolean;
}

const IntegrationSetting: FC<IIntegrationSettingProps> = ({ canEdit }) => {
  const { getApi } = usePermissions();
  const { channelId } = useParams();
  const [isOpen, openModal, closeModal] = useModal();
  const { setVariant, setShow, setJobTitle, setIsExpanded } =
    useBackgroundJobStore();

  const integrationMapping = {
    [DocIntegrationEnum.GoogleDrive]: {
      icon: 'google',
      label: 'Google drive',
    },
    [DocIntegrationEnum.Sharepoint]: {
      icon: 'sharePoint',
      label: 'Sharepoint',
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
  });

  // API call: Re-sync
  const reSync = getApi(ApiEnum.ChannelDocSync);
  const getSyncStatus = getApi(ApiEnum.GetChannelDocSyncStatus);
  const reSyncMutation = useMutation({
    mutationFn: reSync,
    onMutate: () => {
      setVariant(BackgroundJobVariantEnum.ChannelDocumentSync);
      setJobTitle('Sync in progress');
      setIsExpanded(false);
      setShow(true);
    },
    onSuccess: async () => {
      let intervalId: any = null;
      intervalId = setInterval(async () => {
        const response = await getSyncStatus({ channelId }).catch(() => {
          clearInterval(intervalId);
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
            clearInterval(intervalId);
            if (successCount === syncResults.length) {
              setJobTitle('Sync successful');
            } else {
              setJobTitle('Sync failed');
            }
          }
        }
      }, 1000);
    },
    onError: () => {
      setJobTitle('Sync failed');
    },
  });

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

  const popOptions = [
    {
      label: (
        <div className="flex items-center gap-2.5">
          <Icon name="lock-open" size={16} color="text-neutral-900" />
          <span className="font-medium text-xs">Disconnect</span>
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
          <span className="font-medium text-xs">Re-sync</span>
        </div>
      ),
      onClick: () => {
        reSyncMutation.mutate({ channelId } as any);
      },
      dataTestId: 're-sync',
      className: '!px-6 !py-2',
    },
  ].filter((each) => {
    if (!canEdit) return false;
    if (
      (each.dataTestId === 'disconnect' || each.dataTestId === 're-sync') &&
      !isBaseFolderSet
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-3">
      <Header
        title="Integration settings"
        dataTestId="integration-settings"
        className="!mb-0"
      />
      <Card shadowOnHover={canEdit} className="flex px-4 py-6 gap-4">
        <div className="flex flex-col gap-1 w-[400px]">
          <div className="flex gap-2.5 items-center">
            <Icon name={integrationMapping[integrationType].icon} size={24} />
            <span className="text-sm text-neutral-500 font-bold">
              {integrationMapping[integrationType].label}
            </span>
            {isConnectionMade && (
              <div className="text-primary-500 font-bold text-xxs bg-primary-50 px-3 py-1 border border-primary-500 rounded-xl">
                Activated
              </div>
            )}
          </div>
          <p className="text-xs">
            Choose your preferred folder that will be used to create, share, and
            collaborate on files and folders in this channel.
          </p>
        </div>
        <div className="flex flex-col gap-3 flex-grow">
          {isConnectionMade && (
            <div className="flex gap-2 text-xs text-neutral-700 font-medium">
              Last sync: 14th july 2024
            </div>
          )}
          {canEdit && (
            <div className="flex gap-6 w-full">
              {isConnectionMade && !isBaseFolderSet && (
                <Button
                  label="Select existing"
                  variant={ButtonVariant.Secondary}
                  size={Size.Small}
                  onClick={openModal}
                  className="h-9"
                />
              )}
              {!isConnectionMade && (
                <Button
                  label="Connect"
                  size={Size.Small}
                  onClick={() =>
                    window.location.assign(
                      getLearnUrl('/settings/market-place'),
                    )
                  }
                  className="h-9"
                />
              )}
              {integrationType !== DocIntegrationEnum.Sharepoint && (
                <Button
                  label="Add new"
                  leftIcon="plus"
                  size={Size.Small}
                  onClick={() => {}}
                />
              )}
            </div>
          )}
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
        <EntitySelectModal
          isOpen={isOpen}
          closeModal={closeModal}
          onSelect={(entity: any, callback: () => void) =>
            updateConnectionMutation.mutate(
              {
                channelId: channelId,
                folderId: entity[0].id,
                name: entity[0].name,
                orgProviderId: availableAccount?.orgProviderId,
              } as any,
              {
                onSettled: callback,
                onSuccess: () => {
                  successToastConfig({
                    content: `${entity[0].name} connected successfully`,
                  });
                  refetch();
                },
                onError: () => {
                  failureToastConfig({
                    content: 'Fail to connect, Try again!',
                  });
                },
              },
            )
          }
          q={{ orgProviderId: availableAccount?.orgProviderId }}
          integrationType={integrationType}
        />
      )}
    </div>
  );
};

export default IntegrationSetting;
