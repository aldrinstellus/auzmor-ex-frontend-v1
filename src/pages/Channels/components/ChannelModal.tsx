import React, { FC, useEffect } from 'react';
import Layout, { FieldType } from 'components/Form';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Variant as InputVariant } from 'components/Input';
import { ICategoryDetail, useInfiniteCategories } from 'queries/category';
import {
  ChannelVisibilityEnum,
  IChannel,
  useChannelStore,
} from 'stores/channelStore';
import Button, { Variant } from 'components/Button';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Icon from 'components/Icon';
import { IChannelPayload, createChannel, updateChannel } from 'queries/channel';

import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useNavigate from 'hooks/useNavigation';
import { createCatergory, useInfiniteLearnCategory } from 'queries/learn';
import useProduct from 'hooks/useProduct';
import { TFunction } from 'i18next';

interface IChannelModalProps {
  isOpen: boolean;
  closeModal: () => void;
  channelData?: IChannel;
  focusDescription?: boolean;
}

enum ChannelFlow {
  CreateChannel = 'CREATE_CHANNEL',
  EditChannel = 'EDIT_CHANNEL',
}

const getChannelPrivacyOption = (
  visibility: ChannelVisibilityEnum,
  t: TFunction,
) => {
  if (visibility === ChannelVisibilityEnum.Private) {
    return {
      label: (
        <div className="flex gap-2 items-center">
          <Icon name="lock" size={16} color="text-neutral-900" hover={false} />
          <p>{t('private')}</p>
        </div>
      ),
      value: ChannelVisibilityEnum.Private,
      dataTestId: 'channel-privacy-private',
    };
  }
  return {
    label: (
      <div className="flex gap-2 items-center">
        <Icon name="global" size={16} color="text-neutral-900" hover={false} />
        <p>{t('public')}</p>
      </div>
    ),
    value: ChannelVisibilityEnum.Public,
    dataTestId: 'channel-privacy-public',
  };
};

const ChannelModal: FC<IChannelModalProps> = ({
  isOpen,
  closeModal,
  channelData,
  focusDescription = false,
}) => {
  const { t } = useTranslation('channels');
  const { t: tc } = useTranslation('common');
  const { isLxp } = useProduct();
  const schema = yup.object({
    channelName: yup
      .string()
      .min(2, t('channelModal.channelNameMinChars'))
      .test(
        'len',
        t('channelModal.channelNameMaxChars'),
        (val) => (val || '').toString().length <= 100,
      )
      .matches(/^[a-zA-Z0-9 ]*$/, t('channelModal.channelNameNoSpecialChars'))
      .required(t('channelModal.channelNameRequired')),
    channelCategory: yup.object().required(),
    channelPrivacy: yup.object().required(),
    channelDescription: yup
      .string()
      .test(
        'len',
        t('channelModal.channelDescriptionMaxChars'),
        (val) => (val || '').toString().length <= 200,
      ),
  });
  const channelFlow = channelData?.id
    ? ChannelFlow.EditChannel
    : ChannelFlow.CreateChannel;
  const navigate = useNavigate();
  const { setChannels } = useChannelStore();

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    getValues,
    clearErrors,
    watch,
    setValue,
  } = useForm<any>({
    defaultValues: {
      channelName: channelData?.name || '',
      channelPrivacy: getChannelPrivacyOption(
        channelData?.settings?.visibility || ChannelVisibilityEnum.Public,
        t,
      ),
      channelCategory:
        channelData?.categories && channelData?.categories?.length > 0
          ? channelData.categories
              .map((category) => ({
                value: category?.id,
                label: category?.name,
                id: category?.id,
              }))
              .pop()
          : undefined,
      channelDescription: channelData?.description,
    },
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const [channelName, channelPrivacy, channelDescription] = watch([
    'channelName',
    'channelPrivacy',
    'channelDescription',
  ]);

  useEffect(() => {
    if (channelFlow === ChannelFlow.CreateChannel) {
      if (
        channelName &&
        (!channelDescription || isMatchingString(channelDescription))
      ) {
        setValue(
          'channelDescription',
          `This is a ${channelPrivacy.value.toLowerCase()} channel for ${channelName}.`,
        );
      } else if (!channelName && isMatchingString(channelDescription)) {
        setValue('channelDescription', ``);
      }
    }
  }, [channelPrivacy, channelName]);

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
      queryClient.invalidateQueries([isLxp ? 'learnCategory' : 'categories']);
      navigate(`/channels/${response?.result?.data?.id}?showWelcome=true`);

      closeModal();
    },
    onError: async () => {
      failureToastConfig({ content: t('channelModal.createChannelError') });
    },
  });
  const updateChannelMutation = useMutation({
    mutationKey: ['update-channel-mutation'],
    mutationFn: ({ id, payload }: { id: string; payload: IChannelPayload }) =>
      updateChannel(id, payload),
    onSuccess: async (response: any) => {
      setChannels({
        [response?.result?.data?.id]: response?.result?.data,
      });
      queryClient.invalidateQueries(['channel']);
      queryClient.invalidateQueries(['channel-requests']);
      queryClient.invalidateQueries(['channel-members']);

      queryClient.invalidateQueries([isLxp ? 'learnCategory' : 'categories']);
      closeModal();
    },
    onError: async () => {
      failureToastConfig({ content: t('channelModal.editChannelError') });
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
      settings: {
        visibility: formData?.channelPrivacy?.value as ChannelVisibilityEnum,
      },
      categoryIds: [lxpCategoryId || formData?.channelCategory?.value || '']
        .filter(Boolean)
        .map((id) => id.toString()),
    };
    if (channelFlow === ChannelFlow.EditChannel) {
      updateChannelMutation.mutate({ id: channelData?.id || '', payload });
    } else addChannelMutation.mutate(payload);
  };

  const dataTestId =
    channelFlow === ChannelFlow.CreateChannel
      ? 'create-channel'
      : 'edit-channel';

  const isMatchingString = (text: string): boolean => {
    const pattern = /^This is a \w+ channel for .+\.$/;
    return pattern.test(text);
  };

  return (
    <Modal open={isOpen} dataTestId={`${dataTestId}-modal`}>
      <Header
        title={
          channelFlow === ChannelFlow.EditChannel
            ? t('channelModal.editChannel')
            : t('channelModal.createChannel')
        }
        onClose={closeModal}
        closeBtnDataTestId={`${dataTestId}-crossicon`}
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
                placeholder: t('channelModal.channelNamePlaceholder'),
                dataTestId: `${dataTestId}-name`,
                required: true,
                clearErrors,
                error: errors.channelName?.message,
                autofocus: !focusDescription,
                maxLength: 100,
                disableMaxLength: true,
                showCounter: true,
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
                  placeholder: t('channelModal.channelCategoryPlaceholder'),
                  name: 'channelCategory',
                  label: t('channelModal.channelCategoryLabel'),
                  required: true,
                  control,
                  maxLength: 60,
                  fetchQuery: isLxp
                    ? useInfiniteLearnCategory
                    : useInfiniteCategories,
                  getFormattedData: formatCategory,
                  dataTestId: `${dataTestId}-category-dropdown`,
                  getPopupContainer: document.body,
                  error: errors.channelCategory?.message,
                  clearErrors,
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
                  showSearch: false,
                  options: [
                    {
                      ...getChannelPrivacyOption(
                        ChannelVisibilityEnum.Private,
                        t,
                      ),
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
                      ...getChannelPrivacyOption(
                        ChannelVisibilityEnum.Public,
                        t,
                      ),
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
                dataTestId: `${dataTestId}-description`,
                rows: 5,
                maxLength: 200,
                disableMaxLength: true,
                showCounter: true,
                clearErrors,
                error: errors?.channelDescription?.message,
                counterPosition: 'top',
                autoFocus: focusDescription,
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
          dataTestId={`${dataTestId}-cancel`}
        />
        <Button
          label={
            channelFlow === ChannelFlow.EditChannel ? tc('save') : tc('create')
          }
          variant={Variant.Primary}
          onClick={handleSubmit(onSubmit)}
          dataTestId={`${dataTestId}-cta`}
          disabled={!isValid}
        />
      </div>
    </Modal>
  );
};

export default ChannelModal;
