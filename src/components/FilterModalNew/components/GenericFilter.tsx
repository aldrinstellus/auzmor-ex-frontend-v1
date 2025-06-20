import { ICheckboxListOption } from 'components/CheckboxList';
import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import NoDataFound from 'components/NoDataFound';
import Truncate from 'components/Truncate';
import { useDebounce } from 'hooks/useDebounce';
import {
  Control,
  FieldValues,
  Path,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';

interface IGenericFilterProps<TFilters extends FieldValues> {
  options: Record<string, any>[] | string[] | number[];
  name: string;
  control: Control<TFilters, any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<TFilters>;
  transform?: (
    options: Record<string, any>[] | string[] | number[],
  ) => ICheckboxListOption[];
}

const transformOptions = (
  options: Record<string, any>[] | string[] | number[],
): ICheckboxListOption[] => {
  if (!Array.isArray(options)) return [];

  if (typeof options[0] === 'string' || typeof options[0] === 'number') {
    return (options as (string | number)[]).map((item) => ({
      data: {
        id: item,
        label: item,
        value: item,
        meta: [],
      },
      datatestId: `${item}-filter-option-checkbox`,
    }));
  } else {
    return (options as Record<string, any>[]).map((obj, index) => {
      const id = obj.id ?? index;
      const label = obj.label ?? obj.name ?? id;
      const value = obj.value ?? id;
      return {
        data: {
          id,
          label,
          value,
          meta: obj,
        },
        datatestId: `${id}-filter-option-checkbox`,
      };
    });
  }
};

const GenericFilter = <TFilters extends Record<string, any>>({
  options,
  control,
  watch,
  setValue,
  name,
  transform = transformOptions,
}: IGenericFilterProps<TFilters>) => {
  const searchField = [
    {
      type: FieldType.Input,
      control,
      name: `${name}-search`,
      placeholder: 'Search',
      isClearable: true,
      leftIcon: 'search',
      dataTestId: `${name}-search`,
    },
  ];

  const [search, optionCheckbox] = watch([
    `${name}-search`,
    name,
  ]) as Array<any>;

  const debouncedSearchValue = useDebounce(search || '', 300);

  const optionList = transform(options).filter((value) =>
    value.data.label
      .toString()
      .toLowerCase()
      .includes(debouncedSearchValue.toLowerCase()),
  );

  const checkboxFields = [
    {
      type: FieldType.CheckboxList,
      name,
      control,
      options: optionList,
      labelRenderer: (option: ICheckboxListOption) => (
        <Truncate
          text={option.data.label}
          className="ml-2.5 cursor-pointer text-xs max-w-[200px]"
        />
      ),
      rowClassName: 'px-6 py-3 border-b border-neutral-200',
    },
  ];
  return (
    <div className="px-2 py-4">
      <Layout fields={searchField} />
      <div className="max-h-[330px] min-h-[330px] overflow-y-auto">
        {!!optionCheckbox?.length && (
          <div className="flex mt-2 mb-3 flex-wrap">
            {optionCheckbox.map((checkboxOption: ICheckboxListOption) => (
              <div
                key={checkboxOption.data.id}
                data-testid="filter-options"
                className="flex items-center px-3 py-2 bg-neutral-100 rounded-17xl border border-neutral-200 mr-2 my-1"
              >
                <Truncate
                  text={checkboxOption.data.label}
                  className="text-primary-500 text-sm font-medium whitespace-nowrap max-w-[128px]"
                />
                <div className="ml-1">
                  <Icon
                    name="closeCircle"
                    size={16}
                    color="text-neutral-900"
                    onClick={() =>
                      setValue(
                        name as Path<TFilters>,
                        optionCheckbox.filter(
                          (selectedRoles: ICheckboxListOption) =>
                            selectedRoles.data.id !== checkboxOption.data.id,
                        ),
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        {options?.length > 0 ? (
          <Layout fields={checkboxFields} />
        ) : (
          <NoDataFound
            className="py-4 w-full h-full min-h-[330px] flex flex-col justify-center"
            hideClearBtn
          />
        )}
      </div>
    </div>
  );
};

export default GenericFilter;
