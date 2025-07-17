import { useState } from 'react';
import {
  DeepPartial,
  FieldValues,
  useForm,
  UseFormReturn,
} from 'react-hook-form';
import Modal from 'components/Modal';
import Button, { Variant as ButtonVariant, Size } from 'components/Button';
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
    <Modal open={open} closeModal={closeModal} className="max-w-[663px] h-[460px] max-h-[460px] flex flex-col overflow-hidden rounded-2xl">
      <Header
        title={t('title')}
        onClose={closeModal}
        closeBtnDataTestId="close-filters"
        className='shrink-0'
      />

      <form className="flex flex-1 overflow-hidden">
        <div className="flex w-full h-full border-t border-neutral-200">
          <div className="w-1/3 border-r border-neutral-200 overflow-y-auto">
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
                      'text-primary-500 bg-primary-50 hover:cursor-default !font-bold'
                    }`}
                  >
                    {item.label()}
                  </div>
                  {index !== filterNavigation.length - 1 && <Divider />}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-2/3 overflow-y-auto px-2">{activeFilter.component(form)}</div>
        </div>
      </form>

      <div className="shrink-0 flex justify-end items-center p-4 border-t border-neutral-200 bg-blue-50">
        <Button
          label={t('clearFilterCTA')}
          variant={ButtonVariant.Secondary}
          onClick={handleClear}
          className="mr-4"
          dataTestId="clear-filters"
          size={Size.Small}
        />
        <Button
          label={t('applyFilterCTA')}
          variant={ButtonVariant.Primary}
          onClick={handleSubmit(onSubmit)}
          dataTestId="apply-filter"
          size={Size.Small}
        />
      </div>
    </Modal>
  );
};

export default FilterModalNew;
