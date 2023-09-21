import clsx from 'clsx';
import { FC, ReactNode, useMemo } from 'react';
import { Control, FieldValues, useController } from 'react-hook-form';

export interface ICheckboxListOption {
  data: Record<string, any>;
  datatestId: string;
}

interface ICheckboxListProps {
  control: Control<FieldValues, any>;
  name: string;
  options: ICheckboxListOption[];
  labelRenderer: (option: ICheckboxListOption) => ReactNode;
  className?: string;
  rowClassName?: string;
  inputClassName?: string;
}

const CheckboxList: FC<ICheckboxListProps> = ({
  control,
  name,
  options,
  labelRenderer,
  className = '',
  rowClassName = '',
  inputClassName = '',
}) => {
  const { field } = useController({ control, name });
  const style = useMemo(
    () => clsx({ 'flex flex-col': true, [className]: true }),
    [],
  );
  const rowStyle = useMemo(
    () =>
      clsx({
        'flex items-center': true,
        [rowClassName]: true,
      }),
    [],
  );
  return (
    <div className={style}>
      {options.map((option) => (
        <div
          className={rowStyle}
          key={`checkbox-list-option-key-${option.data.id}`}
        >
          <input
            className={`h-4 w-4 rounded-xl flex-shrink-0 cursor-pointer accent-primary-600 ${inputClassName}`}
            onChange={(e) => {
              let newValues: ICheckboxListOption[] = [];
              if (e.target.checked) {
                newValues = [...(field.value || []), option];
              } else {
                newValues = field.value.filter(
                  (value: ICheckboxListOption) =>
                    value.data.id !== option.data.id,
                );
              }
              field.onChange(newValues);
            }}
            id={option.data.id}
            type="checkbox"
            checked={
              !!field?.value?.find(
                (value: ICheckboxListOption) =>
                  option.data.id === value.data.id,
              )
            }
            data-testid={option.datatestId}
          />
          <label htmlFor={option.data.id} className="w-full">
            {labelRenderer(option)}
          </label>
        </div>
      ))}
    </div>
  );
};

export default CheckboxList;
