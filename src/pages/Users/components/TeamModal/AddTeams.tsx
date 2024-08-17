import { Control, FieldErrors, UseFormGetValues } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import { Variant as InputVariant } from 'components/Input';
import { ITeamForm } from '.';
import { CategoryType, useInfiniteCategories } from 'queries/apps';
import { ICategoryDetail } from 'queries/category';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export interface IAddTeamsProps {
  control: Control<ITeamForm, any>;
  errors: FieldErrors<ITeamForm>;
  defaultValues: UseFormGetValues<ITeamForm>;
}

const AddTeams: FC<IAddTeamsProps> = ({ control, errors, defaultValues }) => {
  const { t } = useTranslation('profile', { keyPrefix: 'teamModal.addTeams' });

  const formatCategories = (data: any) => {
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
        dataTestId: `team-category-${category?.type?.toLowerCase()}-${
          category?.name
        }`,
      }),
    );
    return transformedOption;
  };

  const teamName = [
    {
      type: FieldType.Input,
      InputVariant: InputVariant.Text,
      className: '',
      inputClassName: 'py-[11px] text-sm',
      placeholder: t('teamNamePlaceholder'),
      name: `name`,
      label: t('teamNameLabel'),
      required: true,
      control,
      error: errors?.name?.message,
      dataTestId: 'add-team-name',
      showCounter: true,
      maxLength: 100,
      errorDataTestId: 'team-name-error-message',
    },
  ];

  const teamCategory = [
    {
      type: FieldType.CreatableSearch,
      variant: InputVariant.Text,
      placeholder: t('teamCategoryPlaceholder'),
      name: 'category',
      label: t('teamCategoryLabel'),
      required: true,
      control,
      defaultValue: defaultValues()?.category,
      fetchQuery: useInfiniteCategories,
      queryParams: { type: CategoryType.TEAM },
      getFormattedData: formatCategories,
      error: errors.category?.message,
      dataTestId: 'select-team-category',
      addItemDataTestId: 'add-new-category',
    },
  ];

  const teamDescription = [
    {
      type: FieldType.TextArea,
      name: 'description',
      label: t('teamDescriptionLabel'),
      placeholder: t('teamDescriptionPlaceholder'),
      dataTestId: 'add-team-description',
      control,
      defaultValue: defaultValues()?.description || '',
      className: 'resize-none rounded-19xl',
      rows: 4,
      maxLength: 200,
      showCounter: true,
      errorDataTestId: 'team-description-error-message',
    },
  ];

  return (
    <form>
      <div className="p-6 space-y-6">
        <div className="flex space-x-2">
          <Layout fields={teamName} className="w-1/2" />
          <Layout fields={teamCategory} className="w-1/2" />
        </div>
        <Layout fields={teamDescription} />
      </div>
    </form>
  );
};

export default AddTeams;
