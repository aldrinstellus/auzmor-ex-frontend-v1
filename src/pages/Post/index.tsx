import PageLoader from 'components/PageLoader';
import Post from 'components/Post';
import UserCard from 'components/UserWidget';
import useMediaQuery from 'hooks/useMediaQuery';
import { usePageTitle } from 'hooks/usePageTitle';
import { usePermissions } from 'hooks/usePermissions';
import PageNotFound from 'pages/PageNotFound';
import { FC } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useFeedStore } from 'stores/feedStore';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { ComponentEnum } from 'utils/permissions/enums/componentEnum';
import useNavigate from 'hooks/useNavigation';
import Spinner from 'components/Spinner';
import { compressString } from 'utils/misc';

const PostPage: FC = () => {
  usePageTitle('postDetails');
  const isLargeScreen = useMediaQuery('(min-width: 1300px)');
  const { id } = useParams();
  const navigate = useNavigate();
  const { getApi, getComponent } = usePermissions();
  const [searchParams] = useSearchParams();
  const commentId = searchParams.get('commentId') || undefined;
  if (!id) {
    return <div>Error</div>;
  }

  const useGetPost = getApi(ApiEnum.GetPost);
  const { data, isLoading, isError, isFetching } = useGetPost(id, commentId);
  const { getPost } = useFeedStore();

  if (isLoading || isFetching) {
    return <PageLoader />;
  } else if (isError) {
    return <PageNotFound statusCode={404} message={'Post not Found'} />;
  }

  if (!isLoading && data.type === 'DOCUMENT') {
    if(!!data.pathWithId) {
      const encodedPath = compressString(JSON.stringify(data.pathWithId));
      navigate(`/channels/${data.audience[0].entityId}/documents/${encodedPath}`);
    }
    navigate(`/channels/${data.audience[0].entityId}/documents?fileId=${data.documentContext.fileId}&commentId=${commentId}`);
    return null;
  }

  const AnnouncementWidget = getComponent(ComponentEnum.AnnouncementWidget);
  const post = getPost(id);

  const getRightWidgets = () =>
    AnnouncementWidget ? <AnnouncementWidget postId={post.id} /> : <></>;
  return post ? (
    <>
    {isLoading ? <Spinner/> :
      <div className="mb-12 space-x-8 flex w-full">
        <div className="z-10 w-[293px] flex flex-col gap-6">
          <UserCard />
          {!isLargeScreen && getRightWidgets()}
        </div>
        <div className="flex-grow flex flex-col w-6/12">
          <Post
            postId={id}
            commentIds={[(post as any)?.comment?.id].filter(Boolean)}
          />
        </div>
        {isLargeScreen && (
          <div className="z-10 w-[293px] flex flex-col gap-6">
            {getRightWidgets()}
          </div>
        )}
      </div>
    }
    </>
  ) : (
    <PageNotFound statusCode={404} message={'Post not Found'} />
  );
};

export default PostPage;
