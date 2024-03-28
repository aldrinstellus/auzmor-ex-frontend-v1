import { IAudience } from 'queries/audience';
import { FC, memo, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import AudienceRow from './AudienceRow';
import AudienceSkeleton from './AudienceSkeleton';
import AudienceRowSkeleton from './AudienceRowSkeleton';
import { AudienceEntityType } from 'queries/post';
import { useInfiniteAudience } from 'queries/audience';
export interface IAudienceTabProps {
  entity: 'apps' | 'posts';
  entityId: string;
  entityType: AudienceEntityType;
}

const AudienceTab: FC<IAudienceTabProps> = ({
  entity,
  entityId,
  entityType,
}) => {
  const rootId = `${entityId}-${entityType}-${entity}`;
  const { ref, inView } = useInView({
    root: document.getElementById(rootId),
    rootMargin: '20%',
  });

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteAudience(entity, entityId, { entityType });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const audience = data?.pages.flatMap((page: any) => {
    try {
      return page?.data?.result?.data?.map((eachAudience: IAudience) => {
        try {
          return eachAudience;
        } catch (e) {
          console.log('Error', { eachAudience });
        }
      });
    } catch (error) {
      return [];
    }
  }) as IAudience[];

  return (
    <div id={rootId} className="px-6 h-[482px] overflow-y-auto">
      {isLoading ? (
        <AudienceSkeleton />
      ) : (
        audience &&
        audience?.filter(Boolean).map((eachAudience: IAudience) => (
          <div key={eachAudience?.id} className="">
            <AudienceRow audience={eachAudience} />
          </div>
        ))
      )}
      <div>
        {hasNextPage && isFetchingNextPage && <AudienceRowSkeleton />}
        {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
      </div>
    </div>
  );
};

export default memo(AudienceTab);
