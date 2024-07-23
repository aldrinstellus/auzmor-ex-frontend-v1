import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import InfoRow from 'components/ProfileInfo/components/InfoRow';
import Layout, { FieldType } from 'components/Form';
import { IRadioListOption } from 'components/RadioGroup';
import { ChannelVisibilityEnum, IChannel } from 'stores/channelStore';
import { updateChannel } from 'queries/channel';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { useTranslation } from 'react-i18next';

type AppProps = {
  data: IChannel;
  isUserAdminOrChannelAdmin: boolean;
};

const PrivacyRow: FC<AppProps> = ({ data, isUserAdminOrChannelAdmin }) => {
  const { channelId = '' } = useParams();
  const { t } = useTranslation('channelDetail', {
    keyPrefix: 'setting.privacyRow',
  });
  const queryClient = useQueryClient();

  const updateChannelMutation = useMutation({
    mutationKey: ['update-channel-mutation'],
    mutationFn: (data: any) => updateChannel(channelId, data),
    onError: (_error: any) => {},
    onSuccess: async (_response: any) => {
      successToastConfig({});
      await queryClient.invalidateQueries(['channel']);
    },
  });

  const { control } = useForm<any>({
    mode: 'onSubmit',
    defaultValues: {
      privacySetting: data?.settings?.visibility,
    },
  });

  const handleChange = (visibility: ChannelVisibilityEnum) => {
    updateChannelMutation.mutate({
      channelId,
      settings: {
        visibility,
        restriction: data?.settings?.restriction,
      },
    });
  };

  const privacySettingOptions: IRadioListOption[] = [
    {
      data: {
        value: ChannelVisibilityEnum.Private,
        label: t('privateDescription'),
        onChange: handleChange,
      },
      dataTestId: '',
    },
    {
      data: {
        value: ChannelVisibilityEnum.Public,
        label: t('publicDescription'),
        onChange: handleChange,
      },
      dataTestId: '',
    },
  ];

  const fields = [
    {
      type: FieldType.Radio,
      name: 'privacySetting',
      rowClassName: 'space-y-4',
      control,
      disabled: !isUserAdminOrChannelAdmin,
      radioList: privacySettingOptions,
      labelRenderer: (option: IRadioListOption) => {
        return (
          <>
            <div className="text-sm ml-2 text-black font-normal">
              {option.data.value}
              <li className="text-gray-500">{option.data.label}</li>
            </div>
          </>
        );
      },
    },
  ];

  return (
    <InfoRow
      icon={{
        name: 'global-edit',
        color: '!text-orange-500',
        bgColor: '!bg-orange-50',
      }}
      isEditButton={false}
      label={t('label')}
      isEditMode={true}
      value={data?.settings?.visibility}
      dataTestId=""
      border={true}
      editNode={
        <div>
          <form>
            <Layout fields={fields} />
          </form>
        </div>
      }
    />
  );
};

export default PrivacyRow;
