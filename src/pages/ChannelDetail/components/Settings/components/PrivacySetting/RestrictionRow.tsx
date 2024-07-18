import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useParams } from 'react-router-dom';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import InfoRow from 'components/ProfileInfo/components/InfoRow';
import Layout, { FieldType } from 'components/Form';
import { IRadioListOption } from 'components/RadioGroup';
import { updateChannel } from 'queries/channel';
import { IChannel } from 'stores/channelStore';

type AppProps = {
  data: IChannel;
  isUserAdminOrChannelAdmin: boolean;
};
enum ChannelRestriction {
  canPost = 'canPost',
  canComment = 'canComment',
  canAnnouncement = 'canAnnouncement',
}

const RestrictionRow: FC<AppProps> = ({ data, isUserAdminOrChannelAdmin }) => {
  const { channelId = '' } = useParams();
  const queryClient = useQueryClient();

  const upadteChannelMutation = useMutation({
    mutationKey: ['update-channel-mutation'],
    mutationFn: (data: any) => updateChannel(channelId, data),
    onError: (_error: any) => {},
    onSuccess: async (_response: any) => {
      successToastConfig({});
      await queryClient.invalidateQueries(['channel']);
    },
  });
  const handleRestrictionValue = () => {
    const restrictionSettings = data?.settings?.restriction;
    let value = '';

    if (restrictionSettings) {
      const { canPost, canComment, canMakeAnnouncements } = restrictionSettings;
      if (canPost && canComment && !canMakeAnnouncements) {
        value = ChannelRestriction.canPost;
      } else if (canPost && canComment && canMakeAnnouncements) {
        value = ChannelRestriction.canComment;
      } else if (!canPost && canComment && canMakeAnnouncements) {
        value = ChannelRestriction.canAnnouncement;
      }
    }
    return value;
  };

  const { control, getValues } = useForm<any>({
    mode: 'onSubmit',
    defaultValues: {
      restrictionSetting: handleRestrictionValue(),
    },
  });

  const handleChange = (restriction: ChannelRestriction) => {
    let restrictionPayload;
    switch (restriction) {
      case ChannelRestriction.canPost:
        restrictionPayload = {
          canPost: true,
          canComment: true,
          canMakeAnnouncements: false,
        };
        break;
      case ChannelRestriction.canComment:
        restrictionPayload = {
          canPost: true,
          canComment: true,
          canMakeAnnouncements: true,
        };
        break;
      case ChannelRestriction.canAnnouncement:
        restrictionPayload = {
          canPost: false,
          canComment: true,
          canMakeAnnouncements: true,
        };
        break;
      default:
        restrictionPayload = data?.settings?.restriction;
    }
    upadteChannelMutation.mutate({
      channelId,
      settings: {
        restriction: restrictionPayload,
      },
    });
  };

  const restrictionSettingOption: IRadioListOption[] = [
    {
      data: {
        value: ChannelRestriction.canPost,
        label: 'Anyone can post and comment',
        onChange: handleChange,
      },
      dataTestId: '',
    },
    {
      data: {
        value: ChannelRestriction.canComment,
        label: `Anyone can post and comment, but announcements are restricted to owners and admins`,
        onChange: handleChange,
      },
      dataTestId: '',
    },
    {
      data: {
        value: ChannelRestriction.canAnnouncement,
        label: `Anyone can comment, but announcements are restricted to owners and admins`,
        onChange: handleChange,
      },
      dataTestId: '',
    },
  ];
  return (
    <InfoRow
      icon={{
        name: 'lock-open',
        color: '!text-teal-500',
        bgColor: '!bg-teal-50',
      }}
      isEditButton={false}
      label="Restriction"
      isEditMode={true}
      value={data?.settings?.visibility}
      dataTestId="channel-restriction-row"
      border={true}
      editNode={
        <div>
          <Layout
            fields={[
              {
                type: FieldType.Radio,
                name: 'restrictionSetting',
                rowClassName: 'mb-4  ',
                disabled: !isUserAdminOrChannelAdmin,
                control,
                defaultValue: getValues()?.privacySetting,
                radioList: restrictionSettingOption,
                labelRenderer: (option: IRadioListOption) => {
                  return (
                    <>
                      <p className=" text-sm ml-2 text-black font normal  ">
                        {option.data.label}
                      </p>
                    </>
                  );
                },
              },
            ]}
          />
        </div>
      }
    />
  );
};

export default RestrictionRow;
