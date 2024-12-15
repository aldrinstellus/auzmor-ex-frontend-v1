import {
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar';
import { FC, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import AvatarRowSkeleton from './AvatarRowSkeleton';
import AvatarRow from './AvatarRow';
import PageLoader from 'components/PageLoader';
import Button, { Variant } from 'components/Button';
import { IPost } from 'interfaces';
import { twConfig } from 'utils/misc';
import { useTranslation } from 'react-i18next';
import { useFeedStore } from 'stores/feedStore';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';

type AppProps = {
  postId: string;
  closeModal: () => any;
};

const Acknowledged: FC<AppProps> = ({ postId, closeModal }) => {
  const { ref, inView } = useInView();
  const { getApi } = usePermissions();
  const updatePost = useFeedStore((state) => state.updateFeed);
  const post = useFeedStore((state) => state.getPost)(postId);

  const useInfiniteAcknowledgements = getApi(ApiEnum.GetPostAcknowledgements);
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteAcknowledgements(post.id, { acknowledged: true }, (data: any) =>
      updatePost(post.id, {
        ...(post as IPost),
        acknowledgementStats: {
          ...post.acknowledgementStats,
          acknowledged: data?.pages[0]?.data?.result?.totalCount,
        },
      }),
    );

  const usersData = data?.pages.flatMap((page: any) =>
    page?.data?.result?.data.map((user: any) => user),
  );
  const { t } = useTranslation('post', { keyPrefix: 'announcementAnalytics' });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const completePercent = Math.round(
    (post?.acknowledgementStats?.acknowledged * 100) /
      post?.acknowledgementStats?.audience,
  );

  return (
    <div>
      <div className="w-full max-h-[480px] overflow-y-scroll px-6">
        <div className="flex justify-center items-center py-5 border-b">
          <div style={{ width: 64, height: 64 }}>
            <CircularProgressbarWithChildren
              value={completePercent || 0}
              className="center"
              strokeWidth={12}
              styles={buildStyles({
                textSize: '32px',
                pathColor: twConfig.theme.colors.primary[500],
                textColor: '#000000',
                trailColor: '#A3A3A3',
              })}
            >
              <div className="text-sm font-semibold">
                {completePercent || 0}%
              </div>
            </CircularProgressbarWithChildren>
          </div>
          <div className="ml-4">
            <div
              className="text-2xl text-primary-500 font-semibold"
              data-testid="acknowledged-count"
            >
              {t('acknowledgedCount', {
                acknowledged: post?.acknowledgementStats?.acknowledged,
                audience: post?.acknowledgementStats?.audience,
              })}
            </div>
            <div className="text-sm text-neutral-900">{t('markedAsRead')}</div>
          </div>
        </div>
        <div>
          {isLoading ? (
            <AvatarRowSkeleton />
          ) : (
            <div>
              {usersData?.map((user: any) => (
                <AvatarRow key={user.id} {...user} />
              ))}
            </div>
          )}
        </div>
        <div className="h-12 w-12">
          {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
        </div>
        {isFetchingNextPage && <PageLoader />}
      </div>
      <div className="px-6 py-4 bg-blue-50">
        <div className="flex justify-end">
          <Button
            label={t('close')}
            onClick={closeModal}
            variant={Variant.Secondary}
            dataTestId="acknowledgement-report-close"
          />
        </div>
      </div>
    </div>
  );
};

export default Acknowledged;
