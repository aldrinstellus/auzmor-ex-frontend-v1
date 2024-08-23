import { FC, useRef } from 'react';
import 'moment-timezone';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import InfoRow from 'components/ProfileInfo/components/InfoRow';
import { ICategoryDetail, useInfiniteCategories } from 'queries/category';
import { Variant as InputVariant } from 'components/Input';
import useProduct from 'hooks/useProduct';
import { createCatergory, useInfiniteLearnCategory } from 'queries/learn';
import { updateChannel } from 'queries/channel';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { useTranslation } from 'react-i18next';

type AppProps = {
  channelData: any;
  canEdit: boolean;
};

const CategoryRow: FC<AppProps> = ({ channelData, canEdit }) => {
  const queryClient = useQueryClient();
  const ref = useRef<any>(null);
  const { t } = useTranslation('channelDetail', { keyPrefix: 'setting' });

  const { isLxp } = useProduct();
  const updateChannelMutation = useMutation({
    mutationKey: ['update-channel-mutation'],
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      updateChannel(id, payload),
    onSuccess: async () => {
      successToastConfig({});
      ref?.current?.setEditMode(false);
      queryClient.invalidateQueries(['channel']);
      queryClient.invalidateQueries([isLxp ? 'learnCategory' : 'categories']);
    },
    onError: async () => {
      failureToastConfig({});
    },
  });

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

  const { handleSubmit, control, reset, getValues } = useForm<any>({
    mode: 'onSubmit',
    defaultValues: {
      channelCategory:
        channelData?.categories && channelData?.categories?.length > 0
          ? channelData.categories
              .map((category: any) => ({
                value: category?.id,
                label: category?.name,
                id: category?.id,
              }))
              .pop()
          : undefined,
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
      categoryIds: [lxpCategoryId || formData?.channelCategory?.value || '']
        .filter(Boolean)
        .map((id) => id.toString()),
    };
    updateChannelMutation.mutate({ id: channelData?.id || '', payload });
  };
  const fields = [
    {
      type: FieldType.CreatableSearch,
      variant: InputVariant.Text,
      placeholder: t('category.channelCategoryPlaceholder'),
      name: 'channelCategory',
      control,
      fetchQuery: isLxp ? useInfiniteLearnCategory : useInfiniteCategories,
      getFormattedData: formatCategory,
      dataTestId: `channel-category-dropdown`,
      maxLength: 60,
      getPopupContainer: document.body,
    },
  ];

  return (
    <InfoRow
      ref={ref}
      icon={{
        name: 'lock',
        color: 'text-red-500',
        bgColor: 'text-red-50',
      }}
      canEdit={canEdit}
      label={t('category.label')}
      value={channelData?.categories[0]?.name}
      dataTestId="user-marital-status"
      editNode={
        <div>
          <form>
            <Layout fields={fields} />
          </form>
        </div>
      }
      onCancel={reset}
      onSave={handleSubmit(onSubmit)}
      border={false}
    />
  );
};

export default CategoryRow;
