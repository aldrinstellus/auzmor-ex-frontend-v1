import PageLoader from 'components/PageLoader';
import Post from 'components/Post';
import UserCard from 'components/UserWidget';
import { useChannelRole } from 'hooks/useChannelRole';
import useMediaQuery from 'hooks/useMediaQuery';
import { usePageTitle } from 'hooks/usePageTitle';
import { usePermissions } from 'hooks/usePermissions';
import useProduct from 'hooks/useProduct';
import useRole from 'hooks/useRole';
import { ChannelPermissionEnum, getChannelPermissions } from 'pages/ChannelDetail/components/utils/channelPermission';
import PageNotFound from 'pages/PageNotFound';
import { FC } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ChannelVisibilityEnum, IChannel } from 'stores/channelStore';
import { useFeedStore } from 'stores/feedStore';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { ComponentEnum } from 'utils/permissions/enums/componentEnum';
import DocumentPreview from 'components/DocumnetPreview';
import { useChannelDetails } from 'queries/learn';

const PostPage: FC = () => {
  usePageTitle('postDetails');
  const isLargeScreen = useMediaQuery('(min-width: 1300px)');
  const { id } = useParams();
  const { getApi, getComponent } = usePermissions();
  const [searchParams] = useSearchParams();
  const commentId = searchParams.get('commentId') || undefined;
  if (!id) return <div>Error</div>;

  const useGetPost = getApi(ApiEnum.GetPost);
  const { data, isLoading, isError, isFetching } = useGetPost(id, commentId);
  const { getPost } = useFeedStore();

  const entityId = data?.audience?.[0]?.entityId;
  const { isChannelJoined } = useChannelRole(entityId);
  const { isAdmin, isLearner, isSuperAdmin } = useRole();
  const { isLxp } = useProduct();
  const {
    data: resultData,
    isLoading: isChannelLoading,
  } = useChannelDetails(entityId);

  const channelData: IChannel = resultData?.data?.result?.data || null;

  if (isLoading || isFetching || (data?.type === 'DOCUMENT' && (!channelData || isChannelLoading))) {
    return <PageLoader />;
  }

  if (isError || !data) {
    return <PageNotFound statusCode={404} message={'Post not Found'} />;
  }

  const AnnouncementWidget = getComponent(ComponentEnum.AnnouncementWidget);
  const post = getPost(id);

  const getRightWidgets = () =>
    AnnouncementWidget ? <AnnouncementWidget postId={post?.id} /> : null;

  const mainContent =
    data.type === 'DOCUMENT' && entityId ? (
      (() => {
        const permissions = getChannelPermissions(
          isLxp,
          isLearner,
          channelData?.settings?.visibility || ChannelVisibilityEnum.Private,
          isChannelJoined,
          channelData?.member?.role,
          isAdmin,
          isSuperAdmin,
          channelData?.settings?.restriction,
        );

        return (
          <DocumentPreview
            channelId={entityId}
            fileId={data.documentContext.fileId}
            canViewComment={permissions.includes(ChannelPermissionEnum.CanViewCommentDocuments)}
            canPostComment={permissions.includes(ChannelPermissionEnum.CanPostCommentsChannelDoc)}
          />
        );
      })()
    ) : post ? (
      <Post
        postId={id}
        commentIds={[(post as any)?.comment?.id].filter(Boolean)}
      />
    ) : (
      <PageNotFound statusCode={404} message={'Post not Found'} />
    );

  return (
    <div className="mb-12 space-x-8 flex w-full">
      <div className="z-10 w-[293px] flex flex-col gap-6">
        <UserCard />
        {!isLargeScreen && getRightWidgets()}
      </div>

      <div className="flex-grow flex flex-col w-6/12">
        {mainContent}
      </div>

      {isLargeScreen && (
        <div className="z-10 w-[293px] flex flex-col gap-6">
          {getRightWidgets()}
        </div>
      )}
    </div>
  );
};

export default PostPage;
