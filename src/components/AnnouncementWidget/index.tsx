import { useMutation, useQueryClient } from '@tanstack/react-query';
import Card from 'components/Card';
import { announcementRead, useAnnouncementsWidget } from 'queries/post';
import Button, { Size, Variant } from 'components/Button';
import Avatar from 'components/Avatar';
import Icon from 'components/Icon';
import { humanizeTime } from 'utils/time';
import SkeletonLoader from './components/SkeletonLoader';
import RenderQuillContent from 'components/RenderQuillContent';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import { getFullName, getProfileImage } from 'utils/misc';
import EmptyState from './components/EmptyState';
import { FC, memo, useMemo } from 'react';
import { isEmpty } from 'lodash';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useShouldRender } from 'hooks/useShouldRender';
import { CreatePostFlow } from 'contexts/CreatePostContext';
import useRole from 'hooks/useRole';

const ID = 'AnnouncementWidget';

export interface IAnnouncementCardProps {
  postId?: string;
  openModal?: () => void;
  className?: string;
  setCustomActiveFlow?: (e: CreatePostFlow) => void;
}

const AnnouncementCard: FC<IAnnouncementCardProps> = ({
  postId,
  openModal,
  className = '',
  setCustomActiveFlow,
}) => {
  const { t: tp } = useTranslation('profile');
  const { t } = useTranslation('announcement');
  const shouldRender = useShouldRender(ID);
  if (!shouldRender) {
    return <></>;
  }
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isAdmin } = useRole();

  // Default values for useAnnouncementWidget when postId is undefined
  let limit = 1,
    queryKey = 'feed-announcements-widget';

  // If postId is a defined value, then set limit = 2 and modify queryKey
  if (postId) {
    limit = 2;
    queryKey = 'post-announcements-widget';
  }

  const acknowledgeAnnouncement = useMutation({
    mutationKey: ['acknowledge-announcement'],
    mutationFn: announcementRead,
    onError: (error) => console.log(error),
    onSuccess: async () => {
      await queryClient.invalidateQueries([queryKey]);
      await queryClient.invalidateQueries(['feed']);
    },
  });
  const showCreateAnnouncement = isAdmin && !!openModal;

  const { data, isLoading } = useAnnouncementsWidget(limit, queryKey);

  const result = data?.data?.result?.data;

  // By default, postData will be result[0].
  // If postId is defined and result[0].id === postId, then set postData = result[1]
  let postData = result?.[0];
  if (postId && postData?.id === postId) {
    postData = result?.[1];
  }

  const isAcknowledged = postData?.acknowledged;
  const dataPostId = postData?.id;

  const hasLoggedInUserCreatedAnnouncement =
    user?.id === postData?.announcement?.actor?.userId;

  const itemCount = isEmpty(postData) ? 0 : result?.length;

  const style = useMemo(
    () => clsx({ 'min-w-[240px]': true, [className]: true }),
    [className],
  );
  return (
    <div className={style}>
      <div className="flex justify-between items-center ">
        <div className="text-base font-bold">{t('header')}</div>
        {showCreateAnnouncement && (
          <Button
            rightIcon="addCircle"
            label={t('addNew')}
            variant={Variant.Secondary}
            onClick={() => {
              openModal();
              setCustomActiveFlow?.(CreatePostFlow.CreateAnnouncement);
            }}
            className="border-0 !bg-transparent !px-0 !py-1 group"
            labelClassName=" text-primary-500 hover:text-primary-600  group-focus:text-primary-500"
            leftIconSize={20}
          />
        )}
      </div>
      <div className="mt-2">
        <Card
          className="pb-6 flex flex-col rounded-9xl max-h-[386px]"
          shadowOnHover
        >
          <div className="rounded-t-9xl bg-secondary-500 text-white py-3 w-full flex justify-start space-x-3 px-3">
            <Icon
              name="flashIcon"
              className="text-white"
              hover={false}
              size={16}
            />
            <div className="text-xs font-bold">{t('title')}</div>
          </div>
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <div className="w-full px-6">
              {itemCount && !isAcknowledged ? (
                <div className="flex flex-col items-start">
                  <div className="mt-4 w-full">
                    <div className="flex space-x-4">
                      <Avatar
                        name={
                          postData?.createdBy
                            ? getFullName(postData?.createdBy)
                            : tp('nameNotSpecified')
                        }
                        image={getProfileImage(postData?.createdBy)}
                        size={32}
                        className="border-2 border-white"
                        onClick={() =>
                          navigate(
                            postData?.createdBy?.userId === user?.id
                              ? '/profile'
                              : `/users/${postData?.createdBy?.userId}`,
                          )
                        }
                      />

                      <div className="w-full">
                        <div
                          className="flex w-full space-x-1 text-sm cursor-pointer"
                          onClick={() =>
                            navigate(
                              postData?.createdBy?.userId === user?.id
                                ? '/profile'
                                : `/users/${postData?.createdBy?.userId}`,
                            )
                          }
                        >
                          <span className="text-neutral-900">
                            <b>{getFullName(postData?.createdBy)}</b>{' '}
                            {t('share-post')}
                          </span>
                          {/* <span className="text-neutral-900 font-normal bg-yellow-100">
                            shared a post
                          </span> */}
                        </div>
                        <div className="flex space-x-2 items-center">
                          <div className="text-xs text-gray-500">
                            {humanizeTime(postData?.createdAt)}
                          </div>
                          <div className="bg-neutral-500 rounded-full w-1 h-1" />
                          <div className="p-0.5">
                            <Icon
                              name="globalOutline"
                              size={16}
                              hover={false}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link to={`/posts/${dataPostId}`}>
                      <div className="mt-4 flex">
                        <RenderQuillContent
                          data={postData}
                          isAnnouncementWidgetPreview
                        />
                      </div>
                    </Link>
                  </div>
                  {!hasLoggedInUserCreatedAnnouncement && (
                    <div className="w-full flex justify-center">
                      <Button
                        label={t('read-CTA')}
                        variant={Variant.Secondary}
                        size={Size.Small}
                        className="border-2 border-neutral-200 mt-4 w-full"
                        loading={acknowledgeAnnouncement.isLoading}
                        onClick={() => {
                          acknowledgeAnnouncement.mutate(postData.id);
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <EmptyState
                  openModal={openModal}
                  setCustomActiveFlow={setCustomActiveFlow}
                />
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default memo(AnnouncementCard);
