import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import InfoRow from 'components/ProfileInfo/components/InfoRow';
import Layout, { FieldType } from 'components/Form';
import { IRadioListOption } from 'components/RadioGroup';
import { IChannel } from 'stores/channelStore';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';
import queryClient from 'utils/queryClient';

type UploadControlRowProps = {
  data: IChannel;
  canEdit: boolean;
};

const UploadControlRow: FC<UploadControlRowProps> = ({ data, canEdit }) => {
  const { channelId = '' } = useParams();
  const { getApi } = usePermissions();
  const updateChannel = getApi(ApiEnum.UpdateChannel);

  const mapToString = (value: boolean) => {
    if (value) {
      return 'Anyone';
    }
    return 'Channel Admins';
  };

  const mapToBool = (value: string) => {
    if (value === 'Anyone') {
      return true;
    }
    return false;
  };

  const updateChannelMutation = useMutation({
    mutationKey: ['update-channel-mutation'],
    mutationFn: (data: any) => updateChannel(channelId, data),
    onError: (_error: any) => {},
    onSuccess: async (_response: any) => {
      successToastConfig({});
      queryClient.invalidateQueries(['channel']);
    },
  });

  const { control } = useForm<any>({
    mode: 'onSubmit',
    defaultValues: {
      canEditDocuments: mapToString(
        !!data.settings?.restriction?.canEditDocuments,
      ),
    },
  });

  const handleChange = (value: string) => {
    updateChannelMutation.mutate({
      channelId,
      settings: {
        restriction: { canEditDocuments: mapToBool(value) },
      },
    });
  };

  const uploadSettingOptions: IRadioListOption[] = [
    {
      data: {
        value: 'Anyone',
        label: 'Anyone can upload documents',
        onChange: handleChange,
      },
      dataTestId: '',
    },
    {
      data: {
        value: 'Channel Admins',
        label: 'Only Channel Admins can upload documents',
        onChange: handleChange,
      },
      dataTestId: '',
    },
  ];

  const fields = [
    {
      type: FieldType.Radio,
      name: 'canEditDocuments',
      rowClassName: 'space-y-4',
      control,
      disabled: !canEdit,
      radioList: uploadSettingOptions,
      labelRenderer: (option: IRadioListOption) => {
        return (
          <>
            <div className="text-sm ml-2 mt-2 flex flex-col gap-2 text-black font-normal">
              <span className="capitalize">
                {option.data.value.toLowerCase()}
              </span>
              <span className="text-gray-500 leading-4">
                {option.data.label}
              </span>
            </div>
          </>
        );
      },
    },
  ];

  return (
    <InfoRow
      icon={{
        name: 'upload',
        color: '!text-red-500',
        bgColor: '!bg-red-50',
      }}
      isEditButton={false}
      label={<div className="my-6">Who Can Upload Documents</div>}
      isEditMode={true}
      value={data?.settings?.visibility}
      dataTestId=""
      editNode={
        <div>
          <form>
            <Layout fields={fields} />
          </form>
        </div>
      }
      className="!pt-2"
      labelContainerClassName="!w-[416px]"
      editModeWrapperClassName="!w-auto"
    />
  );
};

export default UploadControlRow;
