import { FC, useEffect, useRef } from 'react';
import IconButton, { Size, Variant } from 'components/IconButton';
import PopupMenu from 'components/PopupMenu';
import useModal from 'hooks/useModal';
import { useTranslation } from 'react-i18next';
import Checkbox from 'components/Checkbox';
import { useForm, FormProvider } from 'react-hook-form';

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
    keyPrefix: 'ColumnSelector',
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

  const menuItems = columns.map((item) => ({
    key: item.id,
    renderNode: (
      <Checkbox
        name={item.name}
        control={methods.control}
        label={item.label}
        className="w-full flex item-center !justify-start px-4 py-2 hover:bg-primary-100"
        labelClassName="text-sm !font-normal text-neutral-900"
        dataTestId={`column-selector-checkbox-${item.label}`}
      />
    ),
    dataTestId: `column-selector-item-${item.label}`,
  }));

  const renderTitle = () => (
    <div className="flex justify-between items-center px-6 py-2 font-sm font-medium text-neutral-900"></div>
  );

  const renderFooter = () => (
    <div className="w-full px-6 py-2 font-sm font-bold text-neutral-500 hover:text-primary-500 text-center border-t-1 border-t-neutral-200 cursor-pointer">
      {t('selectedColumns')}
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
