import Layout, { FieldType } from 'components/Form';
import { ChangeEvent, FC, useEffect } from 'react';
import Spinner from 'components/Spinner';
import { useInView } from 'react-intersection-observer';
import { useInfiniteChannelsRequest } from 'queries/channel';
import { useForm } from 'react-hook-form';
import Divider from 'components/Divider';
import NoDataFound from 'components/NoDataFound';
import { IChannelRequest } from 'stores/channelStore';
import RequestRow from './RequestRow';

type ChannelJoinRequestProps = {
  channelId: string;
  dataTestId?: string;
};
const ChannelJoinRequest: FC<ChannelJoinRequestProps> = ({
  channelId,
  dataTestId,
}) => {
  const { setValue, control, getValues } = useForm();
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteChannelsRequest(channelId, {
      limit: 30,
    });

  const requests = data?.pages.flatMap((page) => {
    return (
      page?.data?.result?.data.map((request: IChannelRequest) => {
        try {
          return request;
        } catch (e) {}
      }) || []
    );
  }) as IChannelRequest[];

  const { ref, inView } = useInView({
    root: document.getElementById('entity-search-request-body'),
    rootMargin: '20%',
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const selectAllEntity = () => {
    requests?.forEach((request) => setValue(`request.${request.id}`, request));
  };

  const deselectAll = () => {
    Object.keys(requests || {}).forEach((key) => {
      setValue(`request.${key}`, false);
    });
  };

  const updateSelectAll = () => {};
  return (
    <div className="pl-6 flex flex-col">
      <div className={`flex justify-between py-4 pr-6`}>
        <div className="flex items-center">
          <Layout
            fields={[
              {
                type: FieldType.Checkbox,
                name: 'selectAll',
                control,
                label: 'Select all',
                className: 'flex item-center',
                transform: {
                  input: (value: boolean) => {
                    return value;
                  },
                  output: (e: ChangeEvent<HTMLInputElement>) => {
                    if (e.target.checked) {
                      selectAllEntity();
                    } else {
                      deselectAll();
                    }
                    return e.target.checked;
                  },
                },
                dataTestId: `${dataTestId}-selectall`,
              },
            ]}
          />
          <Layout
            fields={[
              {
                type: FieldType.Checkbox,
                name: 'showSelectedMembers',
                control,
                label: `Show selected members`,
                className: 'flex item-center',
                dataTestId: `${dataTestId}-showselected`,
              },
            ]}
            className="ml-4"
          />
        </div>
        <div
          className="cursor-pointer text-neutral-500 font-semibold hover:underline"
          onClick={() => {
            deselectAll();
            setValue('selectAll', false);
            setValue('showSelectedMembers', false);
          }}
          data-testid={`${dataTestId}-clearall`}
        >
          clear all
        </div>
      </div>
      <ul
        className="flex flex-col max-h-72 overflow-scroll"
        id="entity-search-request-body"
        data-testid={`${dataTestId}-list`}
      >
        {isLoading ? (
          <div className="flex items-center w-full justify-center p-12">
            <Spinner />
          </div>
        ) : requests?.length ? (
          requests?.map((request: IChannelRequest, index: number) => (
            <li key={request.id}>
              <div className="py-2 flex items-center">
                <Layout
                  fields={[
                    {
                      type: FieldType.Checkbox,
                      name: `request.${request.id}`,
                      control,
                      className: 'flex item-center mr-4',
                      transform: {
                        input: (value: any) => {
                          updateSelectAll();
                          return !!value;
                        },
                        output: (e: ChangeEvent<HTMLInputElement>) => {
                          if (e.target.checked) return request;
                          return false;
                        },
                      },
                      dataTestId: `${dataTestId}-select-${request.id}`,
                    },
                  ]}
                />

                <div
                  className="w-full cursor-pointer"
                  onClick={() => {
                    setValue(
                      `request.${request.id}`,
                      !!getValues(`request.${request.id}`) ? false : request,
                    );
                  }}
                >
                  <RequestRow request={request} channelId={channelId} />
                </div>
              </div>
              {index !== requests.length - 1 && <Divider />}
            </li>
          ))
        ) : (
          <NoDataFound
            className="py-4 w-full"
            message={<p>No data found.</p>}
            hideClearBtn
            dataTestId={`${dataTestId}-noresult`}
          />
        )}
        {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
        {isFetchingNextPage && (
          <div className="flex items-center w-full justify-center p-12">
            <Spinner />
          </div>
        )}
      </ul>
    </div>
  );
};
export default ChannelJoinRequest;
