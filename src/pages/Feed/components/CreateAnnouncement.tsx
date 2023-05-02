import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import React, { useContext, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import IconButton, { Variant as IconVariant } from 'components/IconButton';
import { twConfig } from 'utils/misc';
import Button, { Variant as ButtonVariant } from 'components/Button';
import { CreatePostContext } from 'contexts/CreatePostContext';

export interface ICreateAnnouncementProps {}

const CreateAnnouncement = React.forwardRef(
  ({}: ICreateAnnouncementProps, ref) => {
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

    const { setAnnouncement } = useContext(CreatePostContext);

    const onSubmit = (data: any) => {
      setAnnouncement({
        label: data.expityOption.label,
        value: data.expityOption.value,
      });
    };
    const Header: React.FC = () => (
      <div className="flex flex-wrap border-b-1 border-neutral-200 items-center">
        <Icon
          name="arrowLeftOutline"
          stroke={twConfig.theme.colors.neutral['900']}
          className="ml-4"
          size={16}
          onClick={() => {}}
        />

        <div className="text-lg text-black p-4 font-extrabold flex-[50%]">
          Create an announcement
        </div>
        <IconButton
          onClick={() => {}}
          icon={'close'}
          className="!flex-[0] !text-right !p-1 !mx-4 !my-3 !bg-inherit !text-neutral-900"
          variant={IconVariant.Primary}
        />
      </div>
    );
    const Body: React.FC = () => (
      <div className="text-sm text-neutral-900">
        <div className="m-4 min-h-[300px]">
          <div className="flex w-full mb-6">
            <div className="mr-3">
              <Icon name="infoCircleOutline" />
            </div>
            <div className="text-sm text-neutral-500 font-medium">
              This post will be shared as an announcement. Announcements are
              automatically pinned for every user and unpinned when the user
              marks it as read.
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
      </div>
    );
    const Footer: React.FC = () => {
      return (
        <div className="flex justify-end items-center h-16 p-6 bg-blue-50">
          <Button
            variant={ButtonVariant.Secondary}
            label="Back"
            className="mr-3"
            onClick={() => {}}
          />
          <Button label={'Next'} onClick={() => {}} />
        </div>
      );
    };
    return (
      <>
        <Header />
        <Body />
      </>
    );
  },
);

CreateAnnouncement.displayName = 'CreateAnnouncement';

export default CreateAnnouncement;
