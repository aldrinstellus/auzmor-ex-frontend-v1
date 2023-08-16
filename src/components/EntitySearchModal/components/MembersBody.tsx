import Divider from 'components/Divider';
import Layout, { FieldType } from 'components/Form';
import Spinner from 'components/Spinner';
import { useDebounce } from 'hooks/useDebounce';
import {
  IDepartment,
  getDepartments,
  useGetDepartments,
} from 'queries/department';
import { ILocation, getLocations, useGetLocations } from 'queries/location';
import { IGetUser, useInfiniteUsers } from 'queries/users';
import React, { ReactNode, useEffect } from 'react';
import {
  Control,
  UseFormResetField,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { useInView } from 'react-intersection-observer';
import { isFiltersEmpty } from 'utils/misc';
import { IMemberForm } from '..';

interface IMembersBodyProps {
  control: Control<IMemberForm, any>;
  watch: UseFormWatch<IMemberForm>;
  setValue: UseFormSetValue<IMemberForm>;
  resetField: UseFormResetField<IMemberForm>;
  entityRenderer: (data: IGetUser) => ReactNode;
}

const MembersBody: React.FC<IMembersBodyProps> = ({
  control,
  watch,
  setValue,
  resetField,
  entityRenderer,
}) => {
  const formData = watch();
  const debouncedSearchValue = useDebounce(formData.memberSearch || '', 500);
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteUsers({
      q: debouncedSearchValue,
      department: [formData.department?.value || ''],
      location: [formData.location?.value || ''],
    });
  const usersData = data?.pages
    .flatMap((page) => {
      return page?.data?.result?.data.map((user: any) => {
        try {
          return user;
        } catch (e) {
          console.log('Error', { user });
        }
      });
    })
    .filter((user: IGetUser) => {
      if (formData.showSelectedMembers) {
        return !!(formData as any)[user.id];
      }
      return true;
    });
  const { data: locations, isLoading: locationLoading } = useGetLocations('');
  const { data: departments, isLoading: departmentLoading } =
    useGetDepartments('');

  useEffect(() => {
    if (formData.selectAll) {
      selectAll();
    } else {
      deselectAll();
    }
  }, [formData.selectAll]);

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const selectAll = () => {
    Object.keys(formData).forEach((key) => {
      if (
        !!![
          'memberSearch',
          'department',
          'location',
          'selectAll',
          'showSelectedMembers',
        ].includes(key)
      ) {
        setValue(key as any, true);
      }
    });
  };

  const deselectAll = () => {
    Object.keys(formData).forEach((key) => {
      if (
        !!![
          'memberSearch',
          'department',
          'location',
          'selectAll',
          'showSelectedMembers',
        ].includes(key)
      ) {
        setValue(key as any, false);
      }
    });
  };

  const getLocationOptions = (locations: ILocation[]) => {
    return locations.map((location: ILocation) => ({
      label: location.country,
      value: location.uuid,
    }));
  };

  const getDepartmentOptions = (departments: IDepartment[]) => {
    return departments.map((department: IDepartment) => ({
      label: department.name,
      value: department.uuid,
    }));
  };
  return (
    <div className="flex flex-col">
      <div className="flex flex-col py-4 px-6">
        <Layout
          fields={[
            {
              type: FieldType.Input,
              control,
              name: 'memberSearch',
              label: 'Select member',
              placeholder: 'Add via name or email address',
              isClearable: true,
            },
          ]}
          className="pb-4"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            Quick filters:
            <Layout
              fields={[
                {
                  type: FieldType.AsyncSingleSelect,
                  control,
                  name: 'department',
                  option: getDepartmentOptions(departments || []),
                  loadOptions: (inputValue: string) =>
                    getDepartments({ q: inputValue }).then(
                      (departments: IDepartment[]) =>
                        getDepartmentOptions(departments),
                    ),
                  placeholder: 'Department',
                  isLoading: departmentLoading,
                },
              ]}
              className="ml-2"
            />
            <Layout
              fields={[
                {
                  type: FieldType.AsyncSingleSelect,
                  control,
                  name: 'location',
                  placeholder: 'Location',
                  option: getLocationOptions(locations || []),
                  loadOptions: (inputValue: string) =>
                    getLocations({ q: inputValue }).then(
                      (locations: ILocation[]) => getLocationOptions(locations),
                    ),
                  isLoading: locationLoading,
                },
              ]}
              className="ml-2"
            />
          </div>
          <div
            className="cursor-pointer"
            onClick={() => {
              resetField('department');
              resetField('location');
            }}
          >
            Clear filters
          </div>
        </div>
      </div>
      <Divider className="w-full" />
      <div className="pl-6 flex flex-col">
        <div className="flex justify-between py-4 pr-6">
          <div className="flex items-center">
            <Layout
              fields={[
                {
                  type: FieldType.Checkbox,
                  name: 'selectAll',
                  control,
                  label: 'Select all',
                  className: 'flex item-center',
                },
              ]}
            />
            <Layout
              fields={[
                {
                  type: FieldType.Checkbox,
                  name: 'showSelectedMembers',
                  control,
                  label: 'Show selected members',
                  className: 'flex item-center',
                },
              ]}
              className="ml-4"
            />
          </div>
          <div
            className="cursor-pointer"
            onClick={() => {
              setValue('selectAll', false);
              setValue('showSelectedMembers', false);
            }}
          >
            clear all
          </div>
        </div>
        <div className="flex flex-col max-h-72 overflow-scroll">
          {isLoading ? (
            <Spinner />
          ) : (
            usersData?.map((user, index) => (
              <>
                <div className="py-2 flex items-center" key={user.id}>
                  <Layout
                    fields={[
                      {
                        type: FieldType.Checkbox,
                        name: user.id,
                        control,
                        className: 'flex item-center mr-4',
                      },
                    ]}
                  />
                  {entityRenderer(user) || user.fullName}
                </div>
                {index !== usersData.length - 1 && <Divider />}
              </>
            ))
          )}
          {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
        </div>
      </div>
    </div>
  );
};

export default MembersBody;
