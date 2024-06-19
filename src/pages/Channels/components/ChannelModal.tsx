import React, { FC } from 'react';
import Layout, { FieldType } from 'components/Form';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Variant as InputVariant } from 'components/Input';
import { ICategoryDetail, useInfiniteCategories } from 'queries/category';
import { ChannelVisibilityEnum, useChannelStore } from 'stores/channelStore';
import Button, { Variant } from 'components/Button';
import { IOption } from 'components/AsyncSingleSelect';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Icon from 'components/Icon';
import { createChannel } from 'queries/channel';
import { toast } from 'react-toastify';
import { twConfig } from 'utils/misc';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import FailureToast from 'components/Toast/variants/FailureToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createCatergory, useInfiniteLearnCategory } from 'queries/learn';
import useProduct from 'hooks/useProduct';

interface IChannelModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

interface IChannelForm {
  channelName: string;
  channelCategory: ICategoryDetail;
  channelPrivacy: IOption;
  channelDescription: string;
}

const ChannelModal: FC<IChannelModalProps> = ({ isOpen, closeModal }) => {
  const { t } = useTranslation('channels');
  const { t: tc } = useTranslation('common');
  const { isLxp } = useProduct();
  const schema = yup.object({
    channelName: yup
      .string()
      .min(2, 'Channels name should have at least 2 characters')
      .required(),
    channelCategory: yup.object().required(),
    channelPrivacy: yup.object().required(),
  });
  const navigate = useNavigate();
  const { setChannels } = useChannelStore();
  const { handleSubmit, control, formState, getValues } = useForm<IChannelForm>(
    {
      defaultValues: {
        channelName: '',
        channelPrivacy: {
          label: (
            <div className="flex gap-2 items-center">
              <Icon
                name="global"
                size={16}
                color="text-neutral-900"
                hover={false}
              />
              <p>{t('public')}</p>
            </div>
          ),
          value: ChannelVisibilityEnum.Public,
          dataTestId: 'channel-privacy-public',
        },
      },
      resolver: yupResolver(schema),
      mode: 'onChange',
    },
  );

  const formatCategory = (data: any) => {
    const categoriesData = data?.pages.flatMap((page: any) => {
      return page?.data?.result?.data.map((category: any) => {
        try {
          return { ...category, label: category.name };
        } catch (e) {
          console.log('Error', { category });
        }
      });
    });

    const transformedOption = categoriesData?.map(
      (category: ICategoryDetail) => ({
        value: category?.id,
        label: category?.name,
        type: category?.type,
        id: category?.id,
        dataTestId: `category-option-${category?.type?.toLowerCase()}-${
          category?.name
        }`,
      }),
    );
    return transformedOption;
  };
  const queryClient = useQueryClient();

  const addChannelMutation = useMutation({
    mutationKey: ['add-channel-mutation'],
    mutationFn: createChannel,
    onSuccess: async (response: any) => {
      setChannels({
        [response?.result?.data?.id]: response?.result?.data,
      });
      queryClient.invalidateQueries(['channel']);

      navigate(`/channels/${response?.result?.data?.id}`);

      closeModal();
    },
    onError: async () => {
      toast(
        <FailureToast
          content={`Error creating channel`}
          dataTestId="channel-create-error-toaster"
        />,
        {
          closeButton: (
            <Icon name="closeCircleOutline" color="text-red-500" size={20} />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.red['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
          theme: 'dark',
        },
      );
    },
  });
  const onSubmit = async () => {
    const formData = getValues();
    let lxpCategoryId;
    if (
      formData?.channelCategory?.isNew &&
      formData?.channelCategory &&
      isLxp
    ) {
      lxpCategoryId = await createCatergory({
        title: formData?.channelCategory?.label,
      });
      lxpCategoryId = lxpCategoryId?.result?.data?.id;
    }

    const payload = {
      name: formData?.channelName,
      description: formData?.channelDescription,
      visibility: formData?.channelPrivacy?.value,
      category: lxpCategoryId || formData?.channelCategory?.value,
    };
    addChannelMutation.mutate(payload);
  };

  return (
    <Modal open={isOpen} dataTestId="createchannel-modal">
      <Header
        title={t('channelModal.createChannel')}
        onClose={closeModal}
        closeBtnDataTestId="create-channel-crossicon"
      />
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
                dataTestId: 'create-channel-name',
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
                  fetchQuery: isLxp
                    ? useInfiniteLearnCategory
                    : useInfiniteCategories,
                  getFormattedData: formatCategory,
                  dataTestId: 'create-channel-category-dropdown',
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
                      label: (
                        <div className="flex gap-2 items-center">
                          <Icon
                            name="lock"
                            size={16}
                            color="text-neutral-900"
                            hover={false}
                          />
                          <p>{t('private')}</p>
                        </div>
                      ),
                      value: ChannelVisibilityEnum.Private,
                      dataTestId: 'channel-privacy-private',
                      render: () => (
                        <div className="flex gap-3">
                          <div className="flex">
                            <Icon
                              name="lock"
                              size={16}
                              color="text-neutral-900"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="font-medium text-xs text-neutral-900">
                              {t('private')}
                            </div>
                            <p className="text-neutral-500 text-xxs max-w-[224px] whitespace-break-spaces">
                              {t('privateDescription')}
                            </p>
                          </div>
                        </div>
                      ),
                    },
                    {
                      label: (
                        <div className="flex gap-2 items-center">
                          <Icon
                            name="global"
                            size={16}
                            color="text-neutral-900"
                            hover={false}
                          />
                          <p>{t('public')}</p>
                        </div>
                      ),
                      value: ChannelVisibilityEnum.Public,
                      dataTestId: 'channel-privacy-public',
                      render: () => (
                        <div className="flex gap-3">
                          <div className="flex">
                            <Icon
                              name="global"
                              size={16}
                              color="text-neutral-900"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="font-medium text-xs text-neutral-900">
                              {t('public')}
                            </div>
                            <p className="text-neutral-500 text-xxs max-w-[224px] whitespace-break-spaces">
                              {t('publicDescription')}
                            </p>
                          </div>
                        </div>
                      ),
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
                dataTestId: 'create-channel-description',
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
          dataTestId="channel-creation-cancel"
        />
        <Button
          label={tc('create')}
          variant={Variant.Primary}
          onClick={handleSubmit(onSubmit)}
          dataTestId="channel-creation-create"
          disabled={!formState.isValid}
        />
      </div>
    </Modal>
  );
};

export default ChannelModal;
