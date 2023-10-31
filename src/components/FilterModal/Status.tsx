import { ICheckboxListOption } from 'components/CheckboxList';
import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import { useDebounce } from 'hooks/useDebounce';
import { FC } from 'react';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { IFilterForm, IStatus } from '.';
import { UserStatus } from 'queries/users';
import { titleCase } from 'utils/misc';

interface IStatusProps {
  control: Control<IFilterForm, any>;
  watch: UseFormWatch<IFilterForm>;
  setValue: UseFormSetValue<IFilterForm>;
}

const Status: FC<IStatusProps> = ({ control, watch, setValue }) => {
  const searchField = [
    {
      type: FieldType.Input,
      control,
      name: 'statusSearch',
      placeholder: 'Search',
      isClearable: true,
      leftIcon: 'search',
      dataTestId: `status-search`,
    },
  ];

  const [statusSearch, statusCheckbox] = watch([
    'statusSearch',
    'statusCheckbox',
  ]);

  const debouncedStatusSearchValue = useDebounce(statusSearch || '', 300);
  const statusData: IStatus[] = [
    { id: UserStatus.Active, name: titleCase(UserStatus.Active) },
    { id: UserStatus.Inactive, name: titleCase(UserStatus.Inactive) },
    { id: UserStatus.Invited, name: titleCase(UserStatus.Invited) },
  ].filter((value) =>
    value.name.toLowerCase().includes(debouncedStatusSearchValue.toLowerCase()),
  );

  const statusFields = [
    {
      type: FieldType.CheckboxList,
      name: 'statusCheckbox',
      control,
      options: statusData?.map((status: IStatus) => ({
        data: status,
        datatestId: `status-${status.name.toLowerCase()}`,
      })),
      labelRenderer: (option: ICheckboxListOption) => (
        <div className="ml-2.5 cursor-pointer text-xs">{option.data.name}</div>
      ),
      rowClassName: 'px-6 py-3 border-b border-neutral-200',
    },
  ];

  return (
    <div className="px-2 py-4">
      <Layout fields={searchField} />
      <div className="max-h-[330px] min-h-[330px] overflow-y-auto">
        {!!statusCheckbox?.length && (
          <div className="flex mt-2 mb-3 flex-wrap">
            {statusCheckbox.map((status: ICheckboxListOption) => (
              <div
                key={status.data.id}
                data-testid="filter-options"
                className="flex items-center px-3 py-2 bg-neutral-100 rounded-17xl border border-neutral-200 mr-2 my-1"
              >
                <div className="text-primary-500 text-sm font-medium whitespace-nowrap">
                  {status.data.name}
                </div>
                <div className="ml-1">
                  <Icon
                    name="closeCircle"
                    size={16}
                    color="text-neutral-900"
                    onClick={() =>
                      setValue(
                        'statusCheckbox',
                        statusCheckbox.filter(
                          (selectedStatus: ICheckboxListOption) =>
                            selectedStatus.data.id !== status.data.id,
                        ),
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        {(() => {
          if ((statusData || []).length > 0) {
            return (
              <div>
                <Layout fields={statusFields} />
              </div>
            );
          }
          return (
            <>
              {(debouncedStatusSearchValue === undefined ||
                debouncedStatusSearchValue === '') &&
              statusData?.length === 0 ? (
                <div className="flex items-center w-full text-lg font-bold">
                  No Categories found
                </div>
              ) : (
                <div className="py-16 w-full text-lg font-bold text-center">
                  {`No result found`}
                  {debouncedStatusSearchValue &&
                    ` for '${debouncedStatusSearchValue}'`}
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
};

export default Status;
