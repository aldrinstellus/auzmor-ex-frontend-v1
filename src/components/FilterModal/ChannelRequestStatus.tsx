import { ICheckboxListOption } from 'components/CheckboxList';
import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import { useDebounce } from 'hooks/useDebounce';
import { FC } from 'react';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { IChannelRequestStatus, IFilterForm } from '.';
import { titleCase } from 'utils/misc';
import { CHANNEL_MEMBER_STATUS } from 'stores/channelStore';

interface IStatusProps {
  control: Control<IFilterForm, any>;
  watch: UseFormWatch<IFilterForm>;
  setValue: UseFormSetValue<IFilterForm>;
}

export const channelRequestStatusData: IChannelRequestStatus[] = [
  {
    id: CHANNEL_MEMBER_STATUS.APPROVED,
    name: titleCase(CHANNEL_MEMBER_STATUS.APPROVED),
  },
  {
    id: CHANNEL_MEMBER_STATUS.PENDING,
    name: titleCase(CHANNEL_MEMBER_STATUS.PENDING),
  },
  {
    id: CHANNEL_MEMBER_STATUS.REJECTED,
    name: titleCase(CHANNEL_MEMBER_STATUS.REJECTED),
  },
];

const ChannelRequestStatus: FC<IStatusProps> = ({
  control,
  watch,
  setValue,
}) => {
  const searchField = [
    {
      type: FieldType.Input,
      control,
      name: 'channelRequestStatusSearch',
      placeholder: 'Search',
      isClearable: true,
      leftIcon: 'search',
      dataTestId: `channel-request-status-search`,
    },
  ];

  const [channelRequestStatusSearch, channelRequestStatusCheckbox] = watch([
    'channelRequestStatusSearch',
    'channelRequestStatusCheckbox',
  ]);

  const debouncedChannelRequestStatusSearchValue = useDebounce(
    channelRequestStatusSearch || '',
    300,
  );
  channelRequestStatusData.filter((value) =>
    value.name
      .toLowerCase()
      .includes(debouncedChannelRequestStatusSearchValue.toLowerCase()),
  );

  const statusFields = [
    {
      type: FieldType.CheckboxList,
      name: 'channelRequestStatusCheckbox',
      control,
      options: channelRequestStatusData?.map((status: any) => ({
        data: status,
        datatestId: `channel-request-status-${status.name.toLowerCase()}`,
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
        {!!channelRequestStatusCheckbox?.length && (
          <ul className="flex mt-2 mb-3 flex-wrap">
            {channelRequestStatusCheckbox.map(
              (channelRequestStatus: ICheckboxListOption) => (
                <li
                  key={channelRequestStatus.data.id}
                  data-testid="filter-options"
                  className="flex items-center px-3 py-2 bg-neutral-100 rounded-17xl border border-neutral-200 mr-2 my-1"
                >
                  <div className="text-primary-500 text-sm font-medium whitespace-nowrap">
                    {channelRequestStatus.data.name}
                  </div>
                  <div className="ml-1">
                    <Icon
                      name="closeCircle"
                      size={16}
                      color="text-neutral-900"
                      onClick={() =>
                        setValue(
                          'channelRequestStatusCheckbox',
                          channelRequestStatusCheckbox.filter(
                            (selectedStatus: ICheckboxListOption) =>
                              selectedStatus.data.id !==
                              channelRequestStatus.data.id,
                          ),
                        )
                      }
                    />
                  </div>
                </li>
              ),
            )}
          </ul>
        )}
        {(() => {
          if ((channelRequestStatusData || []).length > 0) {
            return (
              <div>
                <Layout fields={statusFields} />
              </div>
            );
          }
          return (
            <>
              {(debouncedChannelRequestStatusSearchValue === undefined ||
                debouncedChannelRequestStatusSearchValue === '') &&
              channelRequestStatusData?.length === 0 ? (
                <div className="flex items-center w-full text-lg font-bold">
                  No status found
                </div>
              ) : (
                <div className="py-16 w-full text-lg font-bold text-center">
                  {`No result found`}
                  {debouncedChannelRequestStatusSearchValue &&
                    ` for '${debouncedChannelRequestStatusSearchValue}'`}
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
};

export default ChannelRequestStatus;
