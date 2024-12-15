import { ICheckboxListOption } from 'components/CheckboxList';
import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import { useDebounce } from 'hooks/useDebounce';
import { FC } from 'react';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { IFilterForm, IRole } from '.';
import { titleCase } from 'utils/misc';
import Truncate from 'components/Truncate';
import { UserRole } from 'interfaces';

interface IStatusProps {
  control: Control<IFilterForm, any>;
  watch: UseFormWatch<IFilterForm>;
  setValue: UseFormSetValue<IFilterForm>;
}

const Roles: FC<IStatusProps> = ({ control, watch, setValue }) => {
  const searchField = [
    {
      type: FieldType.Input,
      control,
      name: 'roleSearch',
      placeholder: 'Search',
      isClearable: true,
      leftIcon: 'search',
      dataTestId: `roles-search`,
    },
  ];

  const [roleSearch, roleCheckbox] = watch(['roleSearch', 'roleCheckbox']);

  const debouncedRoleSearchValue = useDebounce(roleSearch || '', 300);
  const roleData: IRole[] = [
    { id: UserRole.Member, name: titleCase(UserRole.Member) },
    { id: UserRole.Admin, name: titleCase(UserRole.Admin) },
  ].filter((value) =>
    value.name.toLowerCase().includes(debouncedRoleSearchValue.toLowerCase()),
  );

  const rolesFields = [
    {
      type: FieldType.CheckboxList,
      name: 'roleCheckbox',
      control,
      options: roleData?.map((role: IRole) => ({
        data: role,
        datatestId: `role-${role.name.toLowerCase()}`,
      })),
      labelRenderer: (option: ICheckboxListOption) => (
        <>
          <Truncate
            text={option.data.name}
            className="ml-2.5 cursor-pointer text-xs max-w-[200px]"
          />
        </>
      ),
      rowClassName: 'px-6 py-3 border-b border-neutral-200',
    },
  ];

  return (
    <div className="px-2 py-4">
      <Layout fields={searchField} />
      <div className="max-h-[330px] min-h-[330px] overflow-y-auto">
        {!!roleCheckbox?.length && (
          <div className="flex mt-2 mb-3 flex-wrap">
            {roleCheckbox.map((role: ICheckboxListOption) => (
              <div
                key={role.data.id}
                data-testid="filter-options"
                className="flex items-center px-3 py-2 bg-neutral-100 rounded-17xl border border-neutral-200 mr-2 my-1"
              >
                <Truncate
                  text={role.data.name}
                  className="text-primary-500 text-sm font-medium whitespace-nowrap max-w-[128px]"
                />
                <div className="ml-1">
                  <Icon
                    name="closeCircle"
                    size={16}
                    color="text-neutral-900"
                    onClick={() =>
                      setValue(
                        'roleCheckbox',
                        roleCheckbox.filter(
                          (selectedRoles: ICheckboxListOption) =>
                            selectedRoles.data.id !== role.data.id,
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
          if ((roleData || []).length > 0) {
            return (
              <div>
                <Layout fields={rolesFields} />
              </div>
            );
          }
          return (
            <>
              {(debouncedRoleSearchValue === undefined ||
                debouncedRoleSearchValue === '') &&
              roleData?.length === 0 ? (
                <div className="flex items-center w-full text-lg font-bold">
                  No Role found
                </div>
              ) : (
                <div className="py-16 w-full text-lg font-bold text-center">
                  {`No result found`}
                  {debouncedRoleSearchValue &&
                    ` for '${debouncedRoleSearchValue}'`}
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
};

export default Roles;
