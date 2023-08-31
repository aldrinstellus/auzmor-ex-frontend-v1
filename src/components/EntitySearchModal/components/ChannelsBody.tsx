import Divider from 'components/Divider';
import Layout, { FieldType } from 'components/Form';
import Spinner from 'components/Spinner';
import { useDebounce } from 'hooks/useDebounce';
import { IDepartment, useInfiniteDepartments } from 'queries/department';
import { IGetUser } from 'queries/users';
import React, { ReactNode, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteChannels } from 'queries/channel';
import { useEntitySearchFormStore } from 'stores/entitySearchFormStore';

interface IChannelsBodyProps {
  entityRenderer?: (data: IGetUser) => ReactNode;
  selectedChannelIds?: string[];
  dataTestId?: string;
}

const ChannelsBody: React.FC<IChannelsBodyProps> = ({
  entityRenderer,
  selectedChannelIds = [],
}) => {
  const { form } = useEntitySearchFormStore();
  const { watch, setValue, control } = form!;
  const formData = watch();
  const debouncedSearchValue = useDebounce(formData.channelSearch || '', 500);
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteChannels({
      q: debouncedSearchValue,
      privacy: [formData.privacy?.value || ''],
      // category: [formData.categories?.value || ''],
    });
  const usersData = data?.pages
    .flatMap((page) => {
      return page?.data?.result?.data.map((channel: any) => {
        try {
          return channel;
        } catch (e) {
          console.log('Error', { channel });
        }
      });
    })
    .filter((channel) => {
      if (formData.showSelectedMembers) {
        return !!formData.channels[channel.id];
      }
      return true;
    });
  // const { data: privacy, isLoading: privacyLoading } = useGetLocations('');
  const { data: category, isLoading: categoryLoading } =
    useInfiniteDepartments();

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

  useEffect(() => {
    if (selectedChannelIds.length) {
      selectedChannelIds.forEach((id: string) => {
        setValue(`channels.${id}`, true);
      });
    }
  }, []);

  const selectAll = () => {
    Object.keys(formData.channels).forEach((key) => {
      setValue(`channels.${key}`, true);
    });
  };

  const deselectAll = () => {
    Object.keys(formData).forEach((key) => {
      setValue(`channels.${key}`, false);
    });
  };

  // const getLocationOptions = (locations: ILocation[]) => {
  //   return locations.map((location: ILocation) => ({
  //     label: location.country,
  //     value: location.uuid,
  //   }));
  // };

  const getDepartmentOptions = (departments: IDepartment[]) => {
    return departments.map((department: IDepartment) => ({
      label: department.name,
      value: department.id,
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
            {/* <Layout
              fields={[
                {
                  type: FieldType.AsyncSingleSelect,
                  control,
                  name: 'privacy',
                  option: [],
                  // loadOptions: () => {},
                  placeholder: 'Privacy',
                  isLoading: privacyLoading,
                },
              ]}
              className="ml-2"
            /> */}
            <Layout
              fields={[
                {
                  type: FieldType.AsyncSingleSelect,
                  control,
                  name: 'category',
                  placeholder: 'Category',
                  option: () => {},
                  // loadOptions: () => {},
                  isLoading: categoryLoading,
                },
              ]}
              className="ml-2"
            />
          </div>
          <div
            className="cursor-pointer"
            onClick={() => {
              // resetField('department');
              // resetField('location');
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
            <div className="flex items-center w-full justify-center p-12">
              <Spinner />
            </div>
          ) : (
            usersData?.map((user, index) => (
              <>
                <div className="py-2 flex items-center" key={user.id}>
                  <Layout
                    fields={[
                      {
                        type: FieldType.Checkbox,
                        name: `channels.${user.id}`,
                        control,
                        className: 'flex item-center mr-4',
                      },
                    ]}
                  />
                  {(entityRenderer && entityRenderer(user)) || user.fullName}
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

export default ChannelsBody;
