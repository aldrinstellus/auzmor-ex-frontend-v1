import React, { FC } from 'react';
import InfoRow from 'components/ProfileInfo/components/InfoRow';
import { ChannelVisibilityEnum, IChannel } from 'stores/channelStore';
import SwitchToggle from 'components/SwitchToggle';
import { useParams } from 'react-router-dom';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { useMutation } from '@tanstack/react-query';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import queryClient from 'utils/queryClient';
import { useTranslation } from 'react-i18next';

type AppProps = {
  data: IChannel;
  canEdit: boolean;
};

const ChannelVisibilityRow: FC<AppProps> = ({ data, canEdit }) => {
  const { t } = useTranslation('channelDetail', {
    keyPrefix: 'setting.channelVisibilityRow',
  });
  const { channelId = '' } = useParams();
  const { getApi } = usePermissions();
  const updateChannel = getApi(ApiEnum.UpdateChannel);
  const isLearnerAllowedToDiscoverAndRequest = data.settings?.visibility === ChannelVisibilityEnum.Private;

  const updateChannelMutation = useMutation({
    mutationKey: ['update-channel-mutation'],
    mutationFn: (data: any) => updateChannel(channelId, data),
    onError: (_error: any) => {},
    onSuccess: async (_response: any) => {
      successToastConfig({});
      queryClient.invalidateQueries(['channel']);
    },
  });

  const handleChange = (checked: boolean) => {
  updateChannelMutation.mutate({
    channelId,
    settings: {
      restriction: data?.settings?.restriction,
      visibility: checked
        ? ChannelVisibilityEnum.Private
        : ChannelVisibilityEnum.Restricted,
    },
  });
};

  return (
    <InfoRow
      icon={{
        name: 'global',
        color: '!text-red-500',
        bgColor: '!bg-red-50',
      }}
      isEditButton={false}
      label={
        <div className="my-6">
          {t('label')}
        </div>
      }
      isEditMode={true}
      value={isLearnerAllowedToDiscoverAndRequest}
      dataTestId=""
      editNode={
        <SwitchToggle
          defaultValue={isLearnerAllowedToDiscoverAndRequest}
          onChange={(checked) => {
            handleChange(checked);
          }}
          disabled={updateChannelMutation.isLoading || !canEdit}
        />
      }
      className="!pt-2 !pb-2"
      labelContainerClassName="!w-[416px]"
      rowWrapperClassName="items-center"
      editModeWrapperClassName="!w-auto"
    />
  );
};

export default ChannelVisibilityRow;
