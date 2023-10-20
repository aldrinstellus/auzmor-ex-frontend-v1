import AvatarList from 'components/AvatarList';
import Spinner from 'components/Spinner';
import { useAudience } from 'queries/audience';
import { IAudience } from 'queries/post';
import { ITeam } from 'queries/teams';
import { FC, useEffect } from 'react';
import TeamWork from 'images/teamwork.svg';
import { useInView } from 'react-intersection-observer';

interface IAudiencePopupProps {
  entityId?: string;
  audience?: IAudience[];
  title?: string;
  entity?: string;
}

const AudiencePopup: FC<IAudiencePopupProps> = ({
  entityId,
  audience,
  title = 'Posted to:',
  entity = 'posts',
}) => {
  if (audience && audience.length && entityId) {
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
      useAudience(entity, entityId);

    const audienceData = data?.pages.flatMap((page) => {
      return page?.data?.result?.data.map((audience: any) => audience);
    });

    const { ref, inView } = useInView();
    useEffect(() => {
      if (inView) {
        fetchNextPage();
      }
    }, [inView]);

    return isLoading ? (
      <div className="w-full flex justify-center p-4 items-center">
        <Spinner className="ml-0" />
      </div>
    ) : data ? (
      <>
        <div className="px-6 py-3 text-sm text-neutral-900 font-medium">
          {title}
        </div>
        <div className="bg-blue-50 px-6 py-1 text-neutral-500 text-xs font-medium">
          Teams
        </div>
        <div className="max-h-80 overflow-scroll">
          {audienceData?.map((eachTeam: ITeam, index: number) => (
            <div
              className={`flex items-center px-6 py-4 ${
                index !== audienceData!.length - 1 && 'border-b'
              } border-neutral-200`}
              key={eachTeam.id}
            >
              {eachTeam.recentMembers.length > 0 ? (
                <AvatarList
                  size={20}
                  users={eachTeam.recentMembers || []}
                  moreCount={eachTeam.totalMembers}
                  className="-space-x-[8px] mr-2.5"
                  avatarClassName="!b-[1px]"
                />
              ) : (
                <div className="w-4 h-4 bg-neutral-200 rounded-full mr-2.5">
                  <img src={TeamWork} height={16} width={16} />
                </div>
              )}
              <div className="text-xs font-medium text-neutral-900">
                {eachTeam.name}
              </div>
            </div>
          ))}
          {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
        </div>
      </>
    ) : (
      <div className="px-6 py-3">No data</div>
    );
  }
  return <></>;
};

export default AudiencePopup;
