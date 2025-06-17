import { FC, useEffect, useRef } from 'react';
import IconButton, { Size, Variant } from 'components/IconButton';
import PopupMenu from 'components/PopupMenu';
import useModal from 'hooks/useModal';
import { useTranslation } from 'react-i18next';
import Checkbox from 'components/Checkbox';
import { useForm, FormProvider } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';

interface ColumnItem {
  id: string;
  name: string;
  label: string;
  type: string;
  isVisible: boolean;
  dataTestId: string;
}

interface IColumnSelecorProps {
  columns: ColumnItem[];
  updateColumns: (columns: ColumnItem[]) => void;
}

const ColumnSelector: FC<IColumnSelecorProps> = ({
  columns,
  updateColumns,
}) => {
  const [open, openMenu, closeMenu] = useModal();
  const ColumnSelectorRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('components', {
    keyPrefix: 'columnSelector',
  });

  const searchForm = useForm<{ search: string }>({
    defaultValues: { search: '' },
  });

  // Setup react-hook-form for checkboxes
  const methods = useForm<{ [key: string]: boolean }>({
    defaultValues: columns.reduce((acc, col) => {
      acc[col.name] = col.isVisible;
      return acc;
    }, {} as { [key: string]: boolean }),
  });

  // Update columns when checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    const updated = columns.map((col) =>
      col.name === name ? { ...col, isVisible: checked } : col,
    );
    updateColumns(updated);
  };

  // Listen to form changes (debounced to avoid multiple calls)
  useEffect(() => {
    const subscription = methods.watch((values, { name }) => {
      if (name) {
        const checked = values[name];
        const col = columns.find((c) => c.name === name);
        if (col && col.isVisible !== checked) {
          handleCheckboxChange(name, checked as boolean);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [columns, methods]);

  // Keep this useEffect for closing the popup when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        ColumnSelectorRef.current &&
        !ColumnSelectorRef.current.contains(event.target as Node)
      ) {
        closeMenu();
        methods.reset();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [closeMenu]);

  // Filter columns by search
  const searchValue = searchForm.watch('search');
  const filteredColumns = searchValue.trim()
    ? columns.filter((col) =>
        col.label.toLowerCase().includes(searchValue.trim().toLowerCase()),
      )
    : columns;

  const menuItems = filteredColumns.map((item) => ({
    key: item.id,
    renderNode: (
      <Checkbox
        name={item.name}
        control={methods.control}
        label={item.label}
        disabled={item.name === 'name'}
        className="w-full px-3 py-2 hover:bg-primary-100 !justify-start"
        dataTestId={`column-selector-checkbox-${item.label}`}
      />
    ),
    dataTestId: `column-selector-item-${item.label}`,
  }));

  const renderTitle = () => (
    <Layout
      className="w-full p-3 pb-1 text-sm"
      fields={[
        {
          type: FieldType.Input,
          control: searchForm.control,
          name: 'search',
          label: '',
          leftIcon: 'search',
          placeholder: t('search'),
          inputClassName: '!py-1.5',
          dataTestId: `column-selector-search`,
        },
      ]}
    />
  );

  const renderFooter = () => (
    <div className="w-full px-6 py-2 font-sm font-bold text-neutral-500 hover:text-primary-500 text-center border-t-1 border-t-neutral-200 cursor-pointer">
      {t('selectedColumns', {
        selectedCount:
          filteredColumns.filter((item) => item.isVisible).length || 0,
        totalCount: filteredColumns.length || 0,
      })}
    </div>
  );

  return (
    <div className="relative" ref={ColumnSelectorRef}>
      <FormProvider {...methods}>
        <PopupMenu
          controlled
          triggerNode={
            <div
              className="relative group"
              onClick={open ? closeMenu : openMenu}
            >
              <IconButton
                icon="columnSelector"
                variant={Variant.Secondary}
                size={Size.Medium}
                borderAround
                className="bg-white !p-[10px]"
                dataTestId="column-selector-button"
                ariaLabel={t('sort')}
              />
            </div>
          }
          isOpen={open}
          title={renderTitle()}
          footer={renderFooter()}
          menuItems={menuItems}
          className="right-[calc(100%-40px)] w-[204px] top-12 border border-neutral-200"
        />
      </FormProvider>
    </div>
  );
};

export default ColumnSelector;
