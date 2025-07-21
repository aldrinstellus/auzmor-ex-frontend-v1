import { ICheckboxListOption } from 'components/CheckboxList';
import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import NoDataFound from 'components/NoDataFound';
import { IRadioListOption } from 'components/RadioGroup';
import Truncate from 'components/Truncate';
import { useDebounce } from 'hooks/useDebounce';
import {
  Control,
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface IGenericFilterProps<TFilters extends FieldValues> {
  options: Record<string, any>[] | string[] | number[];
  name: string;
  control: Control<TFilters, any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<TFilters>;
  transform?: (
    options: Record<string, any>[] | string[] | number[],
  ) => (ICheckboxListOption | IRadioListOption)[];
  listType?: 'CHECKBOX' | 'RADIO';
}

const transformOptions = (
  options: Record<string, any>[] | string[] | number[],
): (ICheckboxListOption | IRadioListOption)[] => {
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
    return (options as Record<string, any>[]).map((obj) => {
      const id = obj.id ?? obj;
      const label =
        obj.label !== undefined
          ? obj.label
          : typeof obj === 'boolean'
          ? obj
            ? 'Yes'
            : 'No'
          : id;
      const value = obj.value ?? obj;
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
  listType = 'CHECKBOX',
}: IGenericFilterProps<TFilters>) => {
  const { t } = useTranslation('channelDetail');
  const searchField = [
    {
      type: FieldType.Input,
      control,
      name: `${name}-search`,
      placeholder: 'Search',
      isClearable: true,
      leftIcon: 'search',
      dataTestId: `${name}-search`,
      className: 'h-9 text-sm [&_input]:!h-9', 
    },
  ];

  const [search, selectedOptions] = watch([
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

  const radioFields = [
    {
      type: FieldType.Radio,
      name,
      control,
      radioList: optionList,
      labelRenderer: (option: IRadioListOption) => (
        <Truncate
          text={option.data.label}
          className="ml-2.5 cursor-pointer text-xs max-w-[200px]"
        />
      ),
      rowClassName: 'px-6 py-3 border-b border-neutral-200',
    },
  ];
  return (
    <div className="flex flex-col h-full max-h-[400px] px-2 pt-2">
      {listType !== 'RADIO' && (
        <div className="mb-2 shrink-0">
          <Layout fields={searchField} />
        </div>
      )}
       <div className="flex-1 overflow-y-auto">
        {(Array.isArray(selectedOptions) && !!selectedOptions?.length) && (
          <div className="flex mt-2 mb-3 flex-wrap">
            {selectedOptions.map(
              (checkboxOption: ICheckboxListOption | IRadioListOption) => (
                <div
                  key={checkboxOption.data.id}
                  data-testid="filter-options"
                  className="flex items-center px-2 py-1 bg-neutral-100 rounded-17xl border border-neutral-200 mr-1 my-1"
                >
                  <Truncate
                    text={checkboxOption.data.label}
                    className="text-primary-500 text-xs font-medium whitespace-nowrap max-w-[110px]"
                  />
                  <div className="ml-1">
                    <Icon
                      name="closeCircle"
                      size={14}
                      color="text-neutral-900"
                      onClick={() =>
                        setValue(
                          name as Path<TFilters>,
                          selectedOptions.filter(
                            (selectedRoles: ICheckboxListOption | IRadioListOption) =>
                              selectedRoles.data.id !== checkboxOption.data.id,
                          ) as PathValue<TFilters, Path<TFilters>>
                        )
                      }
                    />
                  </div>
                </div>
              ),
            )}
          </div>
        )}
        {optionList?.length > 0 ? (
          <Layout
            fields={listType === 'RADIO' ? radioFields : checkboxFields}
          />
        ) : (
          <NoDataFound
            message={t('refineSearch')}
            className="flex flex-col h-full items-center justify-center"
            illustrationClassName="w-[30%] h-[30%]"
            onClearSearch={() => setValue(`${name}-search` as Path<TFilters>, '' as PathValue<TFilters, Path<TFilters>>)}
          />
        )}
      </div>
    </div>
  );
};

export default GenericFilter;
