import { FC, useEffect } from 'react';
import { isFiltersEmpty } from 'utils/misc';
import AppCardSkeleton from './Skeletons/AppCardSkeleton';
import AppGrid from './AppGrid';
import { useInView } from 'react-intersection-observer';
import PageLoader from 'components/PageLoader';
import TeamNotFound from 'images/TeamNotFound.svg';
import NoDataFound from 'components/NoDataFound';

type ApiCallFunction = (queryParams: any) => any;

interface IAppListProps {
  fetchQuery: ApiCallFunction; // Add API call function prop
  queryParams?: any; // Parameters for the API call
  apps: any;
  showSkeleton?: boolean;
  isInfinite?: boolean;
  showEmptyState?: boolean;
  openAddAppModal?: () => void;
  setAppsCount?: (params: any) => void;
  setTotalAppsCount?: (params: any) => void;
  setAppsLoading?: (params: any) => void;
  resetField?: (key: any, param: any) => void;
  startFetching: boolean;
  myApp: boolean;
  appGridTitle?: string;
}

const AppList: FC<IAppListProps> = ({
  fetchQuery,
  queryParams,
  apps,
  showSkeleton = true,
  isInfinite = true,
  showEmptyState = true,
  openAddAppModal,
  resetField,
  setAppsCount,
  setTotalAppsCount,
  setAppsLoading,
  startFetching,
  myApp,
  appGridTitle,
}) => {
  const { ref, inView } = useInView();
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    fetchQuery({
      q: isFiltersEmpty({
        ...queryParams,
      }),
      startFetching,
      myApp,
    });

  const appIds = data?.pages.flatMap((page: any) => {
    return page.data?.result?.data.map((apps: any) => {
      try {
        return apps;
      } catch (e) {
        console.log('Error', { apps });
      }
    });
  }) as { id: string }[];

  useEffect(() => {
    if (setAppsCount && appIds) {
      setAppsCount(appIds.length);
    }
    if (setTotalAppsCount && appIds) {
      setTotalAppsCount(data?.pages[0]?.data?.result?.totalCount);
    }
  }, [appIds]);

  useEffect(() => {
    if (setAppsLoading) setAppsLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (inView && isInfinite) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <div>
      {(() => {
        if (isLoading && showSkeleton) {
          return (
            <div className="grid grid-cols-3 gap-6 justify-items-center lg:grid-cols-3 1.5lg:grid-cols-4 1.5xl:grid-cols-5 2xl:grid-cols-5">
              {[...Array(30)].map((_value, i) => (
                <div key={`${i}-app-card-skeleton`} className="w-full">
                  <AppCardSkeleton />
                </div>
              ))}
            </div>
          );
        }

        if (appIds && appIds?.length > 0) {
          return (
            <>
              <AppGrid
                apps={appIds
                  ?.filter(({ id }: any) => !!apps[id])
                  ?.map(({ id }: any) => apps[id])}
                title={appGridTitle}
              />
              {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
              {isFetchingNextPage && (
                <div className="h-12">
                  <PageLoader />
                </div>
              )}
            </>
          );
        }

        if (showEmptyState) {
          return (
            <>
              {(queryParams.q === undefined || queryParams.q === '') &&
              !queryParams?.featured &&
              (queryParams.categoryId || []).length === 0 &&
              (queryParams.teamId || []).length === 0 &&
              (!appIds || appIds?.length === 0) ? (
                <div className="flex flex-col space-y-3 items-center w-full">
                  <div className="flex flex-col space-y-6 items-center">
                    <img
                      src={TeamNotFound}
                      alt="Apps Not Found"
                      height={140}
                      width={165}
                    />
                    <div
                      className="text-lg font-bold"
                      data-testid="no-app-found"
                    >
                      No Apps found
                    </div>
                  </div>
                  <div className="flex space-x-1 text-xs font-normal">
                    <div className="text-neutral-500">
                      There is no app found in your organization right now. Be
                      the first to
                    </div>
                    <div
                      className="text-blue-500 cursor-pointer"
                      onClick={openAddAppModal}
                      data-testid="create-app"
                    >
                      create one
                    </div>
                  </div>
                </div>
              ) : (
                <NoDataFound
                  className="py-16 w-full"
                  searchString={queryParams.q}
                  hideClearBtn={queryParams.q ? false : true}
                  onClearSearch={() => {
                    resetField && resetField('search', { defaultValue: '' });
                  }}
                  message={
                    <p>
                      Sorry we can&apos;t find the app you are looking for.
                      <br /> Please try using different filters
                    </p>
                  }
                  dataTestId="app"
                />
              )}
            </>
          );
        }
        return <></>;
      })()}
    </div>
  );
};

export default AppList;
