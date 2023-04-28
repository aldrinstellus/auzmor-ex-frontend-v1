import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import React, { LegacyRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { IAnnouncement } from './CreatePostModal';

export interface ICreateAnnouncementProps {
  announcement: IAnnouncement | null;
  setAnnouncement: (value: IAnnouncement | null) => void;
}

const CreateAnnouncement = React.forwardRef(
  ({ setAnnouncement }: ICreateAnnouncementProps, ref) => {
    useImperativeHandle(ref, () => ({
      getAnnouncemntData() {
        handleSubmit(onSubmit)();
      },
    }));
    const {
      control,
      handleSubmit,
      formState: { errors, isValid },
    } = useForm({
      mode: 'onChange',
    });

    const onSubmit = (data: any) => {
      setAnnouncement({
        label: data.expityOption.label,
        value: data.expityOption.value,
      });
    };
    return (
      <div className="m-4 min-h-[300px]">
        <div className="flex w-full mb-6">
          <div className="mr-3">
            <Icon name="infoCircleOutline" />
          </div>
          <div className="text-sm text-neutral-500 font-medium">
            This post will be shared as an announcement. Announcements are
            automatically pinned for every user and unpinned when the user marks
            it as read.
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Layout
            fields={[
              {
                type: FieldType.SingleSelect,
                name: 'expityOption',
                control,
                options: [
                  { label: '1Week', value: '1Week' },
                  { label: '2Week', value: '2Week' },
                  { label: '3Week', value: '3Week' },
                  { label: '4Week', value: '4Week' },
                  { label: '5Week', value: '5Week' },
                  { label: '6Week', value: '6Week' },
                ],
              },
            ]}
          />
        </form>
      </div>
    );
  },
);

CreateAnnouncement.displayName = 'CreateAnnouncement';

export default CreateAnnouncement;
