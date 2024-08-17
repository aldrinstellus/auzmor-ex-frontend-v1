import Layout, { FieldType } from 'components/Form';
import { Variant as InputVariant } from 'components/Input';
import {
  Control,
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form';
import { ADD_APP_FLOW, IAddAppForm } from './AddApp';
import UploadIconButton from './UploadIconButton';
import Button, { Size, Variant } from 'components/Button';
import { CategoryType, IAudience, useInfiniteCategories } from 'queries/apps';
import { ICategoryDetail } from 'queries/category';
import { FC } from 'react';
import useProduct from 'hooks/useProduct';
import { useInfiniteLearnCategory } from 'queries/learn';
import { useTranslation } from 'react-i18next';
import Truncate from 'components/Truncate';

type AppDetailsFormProps = {
  control: Control<IAddAppForm, any>;
  errors: FieldErrors<IAddAppForm>;
  defaultValues: UseFormGetValues<IAddAppForm>;
  setValue: UseFormSetValue<IAddAppForm>;
  setActiveFlow: (param: ADD_APP_FLOW) => void;
  icon?: IAddAppForm['icon'];
  audience: IAudience[];
};

const AppDetailsForm: FC<AppDetailsFormProps> = ({
  control,
  errors,
  defaultValues,
  setValue,
  setActiveFlow,
  icon,
  audience,
}) => {
  const { isLxp } = useProduct();
  const { t } = useTranslation('appLauncher', {
    keyPrefix: 'addDetailsForm',
  });
  const urlField = [
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      placeholder: t('urlPlaceholder'),
      name: 'url',
      label: t('urlLabel'),
      required: true,
      control: control,
      error: errors.url?.message,
      dataTestId: 'add-app-url',
      errorDataTestId: 'add-app-url-invalid-error',
      inputClassName:
        errors.url || !defaultValues()?.url ? '' : 'text-blue-500 underline',
      autofocus: true,
    },
  ];

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
        dataTestId: `category-option-${category?.type?.toLowerCase()}-${
          category?.name
        }`,
      }),
    );

    return transformedOption;
  };

  const appFields = [
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      placeholder: t('labelPlaceholder'),
      name: 'label',
      label: t('labelLabel'),
      control: control,
      required: true,
      error: errors.label?.message,
      errorDataTestId: 'add-app-label-empty-error',
      dataTestId: 'add-app-label',
    },
    {
      type: FieldType.TextArea,
      name: 'description',
      label: t('descriptionLabel'),
      placeholder: t('descriptionPlaceholder'),
      defaultValue: defaultValues()?.description,
      error: errors.description?.message,
      maxLength: 300,
      disableMaxLength: true,
      errorDataTestId: 'add-app-exceed-description',
      dataTestId: 'about-app-description',
      control,
      className: 'resize-none rounded-19xl',
      rows: 3,
      showCounter: true,
      counterPosition: 'top',
    },
    {
      type: FieldType.CreatableSearch,
      variant: InputVariant.Text,
      placeholder: t('categoryPlaceholder'),
      name: 'category',
      label: t('categoryLabel'),
      control: control,
      maxLength: 60,
      menuPlacement: 'topLeft',
      dataTestId: 'add-app-category',
      addItemDataTestId: 'add-app-add-category',
      fetchQuery: isLxp ? useInfiniteLearnCategory : useInfiniteCategories,
      queryParams: isLxp ? '' : { type: CategoryType.APP },
      getFormattedData: formatCategories,
    },
  ];

  return (
    <div className="py-3">
      <Layout fields={urlField} />
      <div className="flex justify-between gap-x-6 pt-6">
        <Layout fields={appFields} className="w-full flex flex-col gap-y-6" />
        <div className="w-full flex flex-col">
          <UploadIconButton setValue={setValue} icon={icon} />
          <div className="pt-4">
            <p className="text-neutral-900 font-bold pb-1 text-sm">
              {t('audienceLabel')}
            </p>
            {audience.length > 0 ? (
              <div className="flex gap-2">
                <Button
                  key={audience[0].entityId}
                  leftIcon="noteFavourite"
                  leftIconSize={16}
                  leftIconClassName="mr-1"
                  size={Size.Small}
                  variant={Variant.Secondary}
                  label={
                    <Truncate
                      text={audience[0]?.name || t('defaultAudienceName')}
                    />
                  }
                  onClick={() => setActiveFlow(ADD_APP_FLOW.AudienceSelector)}
                  className="group"
                  labelClassName="text-xss text-neutral-900 max-w-[128px] font-medium group-hover:text-primary-500"
                  dataTestId="app-audience-name"
                />
                {audience.length > 1 && (
                  <Button
                    key={audience[0].entityId}
                    variant={Variant.Secondary}
                    size={Size.Small}
                    label={t('moreAudienceLabel', {
                      count: audience.length - 1,
                    })}
                    onClick={() => setActiveFlow(ADD_APP_FLOW.AudienceSelector)}
                    dataTestId="app-audience-more"
                  />
                )}
              </div>
            ) : (
              <Button
                variant={Variant.Secondary}
                label={t('everyoneLabel')}
                size={Size.Small}
                dataTestId="add-app-audience"
                onClick={() => setActiveFlow(ADD_APP_FLOW.AudienceSelector)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDetailsForm;
