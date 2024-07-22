import { FC, useRef } from 'react';
import * as yup from 'yup';
import 'moment-timezone';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Layout, { FieldType } from 'components/Form';
import { useParams } from 'react-router-dom';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import InfoRow from 'components/ProfileInfo/components/InfoRow';
import { updateChannel } from 'queries/channel';
import { IChannel } from 'stores/channelStore';
import { useTranslation } from 'react-i18next';

type AppProps = {
  data: IChannel;
  isUserAdminOrChannelAdmin: boolean;
};

const NameRow: FC<AppProps> = ({ data, isUserAdminOrChannelAdmin }) => {
  const { channelId = '' } = useParams();
  const queryClient = useQueryClient();
  const ref = useRef<any>(null);
  const { t } = useTranslation('channels');
  const { t: tc } = useTranslation('channelDetail', {
    keyPrefix: 'setting.nameRow',
  });
  //channel Name
  const schema = yup.object({
    name: yup
      .string()
      .min(2, t('channelModal.channelNameMinChars'))
      .matches(/^[a-zA-Z0-9 ]*$/, t('channelModal.channelNameNoSpecialChars'))
      .required(t('channelModal.channelNameRequired')),
  });

  // channel update api call
  const updateChannelNameMutation = useMutation({
    mutationFn: (data: any) => updateChannel(channelId, data),
    mutationKey: ['update-channel-name-mutation'],
    onError: (_error: any) => {},
    onSuccess: async (_response: any) => {
      successToastConfig({});
      ref?.current?.setEditMode(false);
      if (channelId) {
        await queryClient.invalidateQueries(['channel']);
      }
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors },
  } = useForm<any>({
    mode: 'onSubmit',
    resolver: yupResolver(schema),
    defaultValues: { name: data?.name },
  });

  const onSubmit = () => {
    const { name } = getValues();
    updateChannelNameMutation.mutate({ name });
  };
  // default value data.name
  const fields = [
    {
      type: FieldType.Input,
      name: 'name',
      placeholder: tc('channelNamePlaceholder'),
      control,
      error: errors?.name?.message,
      defaultValue: data?.name,
      dataTestId: 'employee-id',
    },
  ];

  return (
    <InfoRow
      ref={ref}
      icon={{
        name: 'user-tag',
        color: 'text-teal-500',
        bgColor: 'bg-teal-50',
      }}
      label={tc('label')}
      value={data?.name}
      canEdit={isUserAdminOrChannelAdmin}
      dataTestId="professional-details-employee-id"
      editNode={
        <div>
          <form>
            <Layout fields={fields} />
          </form>
        </div>
      }
      onCancel={reset}
      onSave={handleSubmit(onSubmit)}
    />
  );
};

export default NameRow;
