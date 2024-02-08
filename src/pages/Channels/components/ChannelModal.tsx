import React, { FC } from 'react';
import Layout, { FieldType } from 'components/Form';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Variant as InputVariant } from 'components/Input';
import { ICategoryDetail, useInfiniteCategories } from 'queries/category';
import { ChannelVisibilityEnum } from 'stores/channelStore';
import Button, { Variant } from 'components/Button';
import { IOption } from 'components/AsyncSingleSelect';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

interface IChannelModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

interface IChannelForm {
  channelName: string;
  channelCategory?: ICategoryDetail;
  channelPrivacy?: IOption;
  channelDescription?: string;
}

const ChannelModal: FC<IChannelModalProps> = ({ isOpen, closeModal }) => {
  const { t } = useTranslation('channels');
  const { t: tc } = useTranslation('common');

  const schema = yup.object({
    channeName: yup.string().required('required'),
    // channelCategory: yup.object().required(),
    // channelPrivacy: yup.object().required(),
  });

  const { control, formState } = useForm<IChannelForm>({
    defaultValues: {
      channelName: '',
      channelPrivacy: {
        label: 'Public',
        value: ChannelVisibilityEnum.Public,
        dataTestId: 'channel-privacy-public',
      },
    },
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  console.log(formState.isValid, formState.errors, formState.defaultValues);

  const formatCategory = (data: any) => {
    const skillsData = data?.pages.flatMap((page: any) => {
      return page?.data?.result?.data.map((skill: any) => {
        try {
          return { ...skill, label: skill.name };
        } catch (e) {
          console.log('Error', { skill });
        }
      });
    });

    const transformedOption = skillsData?.map((skill: ICategoryDetail) => ({
      value: skill?.name,
      label: skill?.name,
      id: skill?.id,
      dataTestId: `skill-option-${skill?.name}`,
    }));
    return transformedOption;
  };

  return (
    <Modal open={isOpen}>
      <Header title={t('channelModal.createChannel')} onClose={closeModal} />
      <div className="p-6">
        <div className="flex flex-col items-center gap-6">
          <Layout
            className="w-full"
            fields={[
              {
                type: FieldType.Input,
                control,
                name: 'channelName',
                label: t('channelModal.channelNameLabel'),
                placeholder: 'ex. Product and design team',
                dataTestId: 'channel-name-input',
                showCounter: true,
                maxLength: 100,
                required: true,
              },
            ]}
          />
          <div className="w-full grid grid-cols-2 gap-2">
            <Layout
              className="w-full"
              fields={[
                {
                  type: FieldType.CreatableSearch,
                  variant: InputVariant.Text,
                  placeholder: 'Start typing for suggestions',
                  name: 'channelCategory',
                  label: t('channelModal.channelCategoryLabel'),
                  required: true,
                  control,
                  // defaultValue: defaultValues()?.skills,
                  fetchQuery: useInfiniteCategories,
                  getFormattedData: formatCategory,
                  // error: errors.skills?.message,
                  dataTestId: 'select-skills',
                  getPopupContainer: document.body,
                },
              ]}
            />
            <Layout
              className="w-full"
              fields={[
                {
                  type: FieldType.SingleSelect,
                  control,
                  name: 'channelPrivacy',
                  label: t('channelModal.channelPrivacyLabel'),
                  placeholder: 'ex. Product and design team',
                  dataTestId: 'channel-name-input',
                  required: true,
                  options: [
                    {
                      label: 'Public',
                      value: ChannelVisibilityEnum.Public,
                      dataTestId: 'channel-privacy-public',
                    },
                    {
                      label: 'Private',
                      value: ChannelVisibilityEnum.Private,
                      dataTestId: 'channel-privacy-private',
                    },
                  ],
                },
              ]}
            />
          </div>

          <Layout
            className="w-full"
            fields={[
              {
                type: FieldType.TextArea,
                control,
                name: 'channelDescription',
                label: t('channelModal.channelDescriptionLabel'),
                placeholder: t('channelModal.channelDescriptionPlaceholder'),
                dataTestId: 'channel-name-input',
                rows: 5,
                maxLength: 200,
                showCounter: true,
                counterPosition: 'top',
              },
            ]}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
        <Button
          label={tc('cancel')}
          variant={Variant.Secondary}
          onClick={closeModal}
          className="mr-4"
          dataTestId="app-launcher-select-app-back"
        />
        <Button
          label={tc('create')}
          variant={Variant.Primary}
          // onClick={handleSubmit(onSubmit)}
          dataTestId="app-launcher-select-cta"
          disabled={!formState.isValid}
        />
      </div>
    </Modal>
  );
};

export default ChannelModal;
