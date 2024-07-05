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
import useAuth from 'hooks/useAuth';
import { isTrim } from 'pages/ChannelDetail/components/utils';

type AppProps = {
  channelData: IChannel;
};

const DescriptionRow: FC<AppProps> = ({ channelData }) => {
  const { channelId = '' } = useParams();
  const queryClient = useQueryClient();
  const ref = useRef<any>(null);

  const { user } = useAuth();
  const isOwnerOrAdmin = channelData?.createdBy?.userId == user?.id;

  //channel Name
  const schema = yup.object({
    name: yup.string(),
  });

  // channel update api call
  const updateChannelMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      updateChannel(id, payload),
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

  const { handleSubmit, control, reset, getValues } = useForm<any>({
    mode: 'onSubmit',
    resolver: yupResolver(schema),
    defaultValues: {
      channelDescription: channelData?.description || undefined,
    },
  });

  const onSubmit = () => {
    const formData = getValues();
    const payload = { description: formData?.channelDescription };
    updateChannelMutation.mutate({ id: channelId || '', payload });
  };
  // default value data.name
  const fields = [
    {
      type: FieldType.TextArea,
      control,
      name: 'channelDescription',
      label: 'Channel Description',
      defaultValue: getValues()?.channelDescription || '',
      dataTestId: `channel-description`,
      rows: 5,
      maxLength: 200,
      showCounter: true,
      counterPosition: 'top',
    },
  ];

  return (
    <InfoRow
      ref={ref}
      icon={{
        name: 'message-tag',
        color: 'text-orange-500',
        bgColor: 'bg-orange-50',
      }}
      label="Description"
      value={isTrim(channelData?.description)}
      canEdit={isOwnerOrAdmin}
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

export default DescriptionRow;
