import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import IconButton, { Variant as IconVariant } from 'components/IconButton';
import { twConfig } from 'utils/misc';
import Button, {
  Variant as ButtonVariant,
  Type as ButtonType,
} from 'components/Button';
import { CreatePostContext, CreatePostFlow } from 'contexts/CreatePostContext';
import { Value } from 'react-date-picker/dist/cjs/shared/types';
import { afterXUnit } from 'utils/time';

export interface ICreateAnnouncementProps {
  closeModal: () => void;
}

const CreateAnnouncement: React.FC<ICreateAnnouncementProps> = ({
  closeModal,
}) => {
  const { setAnnouncement, setActiveFlow, announcement, clearPostContext } =
    useContext(CreatePostContext);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue,
    getValues,
  } = useForm({
    mode: 'onChange',
  });

  const selecetedExpiry = watch('expityOption');

  const onSubmit = (data: any) => {
    setAnnouncement({
      label: data.expityOption.label,
      value: data.expityOption.value,
    });
    setActiveFlow(CreatePostFlow.CreatePost);
  };
  const Header: React.FC = () => (
    <div className="flex flex-wrap border-b-1 border-neutral-200 items-center">
      <Icon
        name="arrowLeftOutline"
        stroke={twConfig.theme.colors.neutral['900']}
        className="ml-4"
        size={16}
        onClick={() => setActiveFlow(CreatePostFlow.CreatePost)}
      />

      <div className="text-lg text-black p-4 font-extrabold flex-[50%]">
        Create an announcement
      </div>
      <IconButton
        onClick={() => {
          clearPostContext();
          closeModal();
        }}
        icon={'close'}
        className="!flex-[0] !text-right !p-1 !mx-4 !my-3 !bg-inherit !text-neutral-900"
        variant={IconVariant.Primary}
      />
    </div>
  );
  const Body: React.FC = () => (
    <form onSubmit={handleSubmit(onSubmit)}>
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

          <Layout
            fields={[
              {
                type: FieldType.SingleSelect,
                name: 'expityOption',
                control,
                options: [
                  {
                    label: '1 Day',
                    value:
                      afterXUnit(1, 'days').toISOString().substring(0, 19) +
                      'Z',
                  },
                  {
                    label: '1 Week',
                    value:
                      afterXUnit(1, 'weeks').toISOString().substring(0, 19) +
                      'Z',
                  },
                  {
                    label: '2 Weeks',
                    value:
                      afterXUnit(2, 'weeks').toISOString().substring(0, 19) +
                      'Z',
                  },
                  {
                    label: '1 Month',
                    value:
                      afterXUnit(1, 'months').toISOString().substring(0, 19) +
                      'Z',
                  },
                  { label: 'Custom Date', value: '' },
                ],
                defaultValue: announcement,
              },
            ]}
          />
          {((selecetedExpiry && selecetedExpiry.label === 'Custom Date') ||
            (announcement && announcement.label === 'Custom Date')) && (
            <Layout
              fields={[
                {
                  type: FieldType.DatePicker,
                  name: 'date',
                  control,
                  minDate: new Date(),
                  defaultValue: announcement?.value || '',
                  onDateChange: (date: Value) => {
                    const dateValue = date?.toString();
                    setValue('expityOption', {
                      label: 'Custom Date',
                      value:
                        new Date(dateValue || '')
                          .toISOString()
                          .substring(0, 19) + 'Z',
                    });
                  },
                },
              ]}
              className="mt-6"
            />
          )}
        </div>
      </div>
      <div className="flex justify-end items-center h-16 p-6 bg-blue-50">
        <Button
          variant={ButtonVariant.Secondary}
          label="Back"
          className="mr-3"
          onClick={() => setActiveFlow(CreatePostFlow.CreatePost)}
        />
        <Button label={'Next'} type={ButtonType.Submit} />
      </div>
    </form>
  );
  return (
    <>
      <Header />
      <Body />
    </>
  );
};

CreateAnnouncement.displayName = 'CreateAnnouncement';

export default CreateAnnouncement;
