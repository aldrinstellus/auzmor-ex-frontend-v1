import { Menu } from '@headlessui/react';
import AvatarList from 'components/AvatarList';
import Icon from 'components/Icon';
import Spinner from 'components/Spinner';
import { useAudience } from 'queries/audience';
import { IAudience } from 'queries/post';
import { ITeam } from 'queries/teams';
import React, { useEffect } from 'react';
import TeamWork from 'images/teamwork.svg';
import { useInView } from 'react-intersection-observer';

interface IAudiencePopupProps {
  entityId?: string;
  audience?: IAudience[];
  title?: string;
}

const AudiencePopup: React.FC<IAudiencePopupProps> = ({
  entityId,
  audience,
  title = 'Posted to:',
}) => {
  if (audience && audience.length && entityId) {
    const {
      data,
      error,
      refetch,
      isLoading,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
    } = useAudience(entityId, {
      enabled: false,
    });

    const audienceData = data?.pages.flatMap((page) => {
      return page?.data?.result?.data.map((audience: any) => audience);
    });

    const { ref, inView } = useInView();
    useEffect(() => {
      if (inView) {
        fetchNextPage();
      }
    }, [inView]);

    return (
      <div className="relative">
        <Menu>
          <Menu.Button as="div">
            <Icon name="noteFavourite" size={16} />
          </Menu.Button>
          <Menu.Items
            className={`bg-white rounded-9xl shadow-lg absolute z-[99999] overflow-hidden min-w-[256px] border border-neutral-200`}
          >
            {({ open }) => {
              if (!data && open && !error) {
                refetch();
              }
              return isLoading ? (
                <Spinner />
              ) : data ? (
                <>
                  <div className="px-6 py-3 text-sm text-neutral-900 font-medium">
                    {title}
                  </div>
                  <div className="max-h-80 overflow-scroll">
                    {/* <div className="bg-blue-50 px-6 py-1 text-neutral-500 text-xs font-medium">
                    Channels
                  </div>
                  <div className="flex items-center px-6 py-3 border-b border-neutral-200">
                    <div className="w-4 h-4 rounded-full bg-blue-500 mr-2.5"></div>
                    <div className="text-xs font-medium text-neutral-900">
                      HR updates
                    </div>
                  </div> */}

                    <div className="bg-blue-50 px-6 py-1 text-neutral-500 text-xs font-medium">
                      Teams
                    </div>
                    {audienceData?.map((eachTeam: ITeam) => (
                      <Menu.Item key={eachTeam.id}>
                        <div className="flex items-center px-6 py-3 border-b border-neutral-200">
                          {eachTeam.recentMembers.length > 0 ? (
                            <AvatarList
                              size={16}
                              users={eachTeam.recentMembers || []}
                              moreCount={eachTeam.totalMembers}
                              className="mr-2 -space-x-2"
                            />
                          ) : (
                            <div className="w-4 h-4 bg-neutral-200 rounded-full mr-2">
                              <img src={TeamWork} height={16} width={16} />
                            </div>
                          )}
                          <div className="text-xs font-medium text-neutral-900">
                            {eachTeam.name}
                          </div>
                        </div>
                      </Menu.Item>
                    ))}
                    {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
                  </div>
                </>
              ) : (
                <div className="px-6 py-3">No data</div>
              );
            }}
          </Menu.Items>
        </Menu>
      </div>
    );
  }
  return <Icon name="global" size={16} />;
};

export default AudiencePopup;
