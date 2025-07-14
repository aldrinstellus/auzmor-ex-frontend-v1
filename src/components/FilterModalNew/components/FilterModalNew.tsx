import { useState } from 'react';
import {
  DeepPartial,
  FieldValues,
  useForm,
  UseFormReturn,
} from 'react-hook-form';
import Modal from 'components/Modal';
import Button, { Variant as ButtonVariant } from 'components/Button';
import Divider from 'components/Divider';
import Header from 'components/ModalHeader';
import { useTranslation } from 'react-i18next';

export interface IFilterNavigation<TFilters extends FieldValues> {
  key: string;
  label: () => string;
  dataTestId?: string;
  component: (form: UseFormReturn<TFilters, any>) => React.ReactNode;
}

export interface IFilterModalNewProps<TFilters extends FieldValues> {
  open: boolean;
  closeModal: () => void;
  appliedFilters: Partial<TFilters>;
  onApply: (filters: TFilters) => void;
  onClear: () => void;
  filterNavigation: IFilterNavigation<TFilters>[];
  defaultValues: TFilters;
}

const FilterModalNew = <TFilters extends Record<string, any>>({
  open,
  closeModal,
  appliedFilters,
  onApply,
  onClear,
  filterNavigation,
  defaultValues,
}: IFilterModalNewProps<TFilters>) => {
  const { t } = useTranslation('filterModal');
  const form = useForm<TFilters>({
    mode: 'onChange',
    defaultValues: {
      ...(defaultValues as DeepPartial<TFilters>),
      ...(appliedFilters as DeepPartial<TFilters>),
    },
  });

  const { handleSubmit, reset, getValues } = form;

  const [activeFilter, setActiveFilter] = useState(filterNavigation[0]);

  const onSubmit = () => {
    const values = getValues();
    onApply(values);
  };

  const handleClear = () => {
    reset(defaultValues);
    onClear();
  };

  return (
    <Modal open={open} closeModal={closeModal} className="max-w-[665px]">
      <Header
        title={t('title')}
        onClose={closeModal}
        closeBtnDataTestId="close-filters"
      />

      <form>
        <div className="flex w-full">
          <div className="flex flex-col w-1/3 pb-64 border-r-2 border-r-neutral-200">
            <ul className="border-b-2 border-b-bg-neutral-200">
              {filterNavigation.map((item, index) => (
                <li
                  key={item.key}
                  onClick={() => setActiveFilter(item)}
                  data-testid={item?.dataTestId}
                >
                  <div
                    className={`text-sm font-medium p-4 hover:cursor-pointer ${
                      item.key === activeFilter.key &&
                      'text-primary-500 bg-primary-50 hover:cursor-default'
                    }`}
                  >
                    {item.label()}
                  </div>
                  {index !== filterNavigation.length - 1 && <Divider />}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-2/3">{activeFilter.component(form)}</div>
        </div>
      </form>

      <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
        <Button
          label={t('clearFilterCTA')}
          variant={ButtonVariant.Secondary}
          onClick={handleClear}
          className="mr-4"
          dataTestId="clear-filters"
        />
        <Button
          label={t('applyFilterCTA')}
          variant={ButtonVariant.Primary}
          onClick={handleSubmit(onSubmit)}
          dataTestId="apply-filter"
        />
      </div>
    </Modal>
  );
};

export default FilterModalNew;
