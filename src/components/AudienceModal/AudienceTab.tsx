import { IAudience } from 'queries/audience';
import { FC, memo, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import AudienceRow from './AudienceRow';
import AudienceSkeleton from './AudienceSkeleton';
import AudienceRowSkeleton from './AudienceRowSkeleton';
import { AudienceEntityType } from 'queries/post';
import { useInfiniteAudience } from 'queries/audience';
import { isFiltersEmpty } from 'utils/misc';
import PageLoader from 'components/PageLoader';

export interface IAudienceTabProps {
  entity: 'apps' | 'posts';
  entityId: string;
  entityType?: AudienceEntityType;
}

const AudienceTab: FC<IAudienceTabProps> = ({
  entity,
  entityId,
  entityType,
}) => {
  const { ref, inView } = useInView({
    rootMargin: '20%',
  });

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteAudience(entity, entityId, isFiltersEmpty({ entityType }));

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

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
    <div className="px-6 h-[482px] overflow-y-auto">
      {isLoading ? (
        <AudienceSkeleton />
      ) : (
        audience?.filter(Boolean).map((eachAudience: IAudience) => (
          <div key={eachAudience?.id} className="">
            <AudienceRow audience={eachAudience} />
          </div>
        ))
      )}
      <div ref={ref}>
        {hasNextPage && !isFetchingNextPage && <AudienceRowSkeleton />}
      </div>
      {isFetchingNextPage && (
        <div className="h-12 w-full flex items-center justify-center">
          <PageLoader />
        </div>
      )}
    </div>
  );
};

export default memo(AudienceTab);
