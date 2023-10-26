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
import {
  // App,
  CategoryType,
  IAudience,
  useInfiniteCategories,
} from 'queries/apps';
import { ICategoryDetail } from 'queries/category';
import { FC } from 'react';

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
  const urlField = [
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      placeholder: 'Enter URL',
      name: 'url',
      label: 'URL',
      required: true,
      control: control,
      defaultValue: defaultValues()?.url,
      error: errors.url?.message,
      dataTestId: 'add-app-url',
      errorDataTestId: 'add-app-url-invalid-error',
      inputClassName:
        errors.url || !defaultValues()?.url ? '' : 'text-blue-500 underline',
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
      placeholder: 'Enter label',
      name: 'label',
      label: 'Label',
      control: control,
      required: true,
      defaultValue: defaultValues()?.label,
      error: errors.label?.message,
      errorDataTestId: 'add-app-label-empty-error',
      dataTestId: 'add-app-label',
    },
    {
      type: FieldType.TextArea,
      name: 'description',
      label: 'Short description',
      placeholder: 'Enter description',
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
    },
    {
      type: FieldType.CreatableSearch,
      variant: InputVariant.Text,
      placeholder: 'Select category',
      name: 'category',
      label: 'Category',
      control: control,
      defaultValue: defaultValues()?.category,
      menuPlacement: 'topLeft',
      dataTestId: 'add-app-category',
      addItemDataTestId: 'add-app-add-category',
      fetchQuery: useInfiniteCategories,
      queryParams: { type: CategoryType.APP },
      getFormattedData: formatCategories,
    },
  ];

  return (
    <div className="py-3">
      <div className="">
        <Layout fields={urlField} />
      </div>
      <div className="flex justify-between gap-x-6 pt-6">
        <Layout fields={appFields} className="w-full flex flex-col gap-y-6" />
        <div className="w-full">
          <UploadIconButton setValue={setValue} icon={icon} />
          <div className="pt-8">
            <p className="text-neutral-900 font-bold pb-2 text-sm">Audience</p>
            {audience.length > 0 ? (
              <div className="flex gap-2">
                <Button
                  key={audience[0].entityId}
                  leftIcon="noteFavourite"
                  leftIconSize={16}
                  leftIconClassName="mr-1"
                  size={Size.Small}
                  variant={Variant.Secondary}
                  label={audience[0].name || 'Team Name'}
                  onClick={() => setActiveFlow(ADD_APP_FLOW.AudienceSelector)}
                  dataTestId="app-audience-name"
                />
                {audience.length > 1 && (
                  <Button
                    key={audience[0].entityId}
                    variant={Variant.Secondary}
                    size={Size.Small}
                    label={`+ ${audience.length - 1} more`}
                    onClick={() => setActiveFlow(ADD_APP_FLOW.AudienceSelector)}
                    dataTestId="app-audience-more"
                  />
                )}
              </div>
            ) : (
              <Button
                variant={Variant.Secondary}
                label="Everyone"
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
