import React, { ReactNode, useEffect, useState } from 'react';
import { DeltaStatic } from 'quill';
// import ActivityFeed from 'components/ActivityFeed';
import Icon from 'components/Icon';
import { IMenuItem } from 'components/PopupMenu';
import { twConfig } from 'utils/misc';
import Divider, { Variant } from 'components/Divider';
import PostBuilder from 'components/PostBuilder';
import { IGetPost, useInfiniteFeed } from 'queries/post';
import CreatePostCard from 'components/PostBuilder/components/CreatePostCard';
import Post from 'components/Post';
import { useInView } from 'react-intersection-observer';

interface IFeedProps {}

export interface IPostTypeIcon {
  id: string;
  label: string;
  icon: ReactNode;
  menuItems: IMenuItem[];
  divider?: ReactNode;
}

export interface IProfileImage {
  blurHash: string;
  url: string;
}

export interface ICreated {
  designation: string;
  fullName: string;
  userId: string;
  workLocation: string;
  status: string;
  department: string;
  profileImage: IProfileImage;
}
export interface IMyReactions {
  id: string;
  type: string;
  reaction: string;
  createdBy: ICreated;
}

export const postTypeMapIcons: IPostTypeIcon[] = [
  {
    id: '1',
    label: 'Media',
    icon: <Icon name="imageFilled" fill="#000000" size={14} />,
    menuItems: [
      {
        renderNode: (
          <div className="flex px-6 py-3 items-center hover:bg-primary-50">
            <Icon
              name="image"
              size={10}
              className="p-2 rounded-7xl border mr-2.5 bg-white"
              fill={twConfig.theme.colors.primary['500']}
            />
            <div className="text-sm text-neutral-900 font-medium">
              Upload a photo
            </div>
          </div>
        ),
      },
      {
        renderNode: (
          <div className="flex px-6 py-3 items-center hover:bg-primary-50">
            <Icon
              name="video"
              size={16}
              className="p-2 rounded-7xl border mr-2.5 bg-white"
              fill={twConfig.theme.colors.primary['500']}
            />
            <div className="text-sm text-neutral-900 font-medium">
              Upload a video
            </div>
          </div>
        ),
      },
      {
        renderNode: (
          <div className="flex px-6 py-3 items-center hover:bg-primary-50">
            <Icon
              name="document"
              size={16}
              className="p-2 rounded-7xl border mr-2.5 bg-white"
              fill={twConfig.theme.colors.primary['500']}
            />
            <div className="text-sm text-neutral-900 font-medium">
              Share a document
            </div>
          </div>
        ),
      },
    ],
    divider: <Divider variant={Variant.Vertical} />,
  },
  {
    id: '2',
    label: 'Shoutout',
    icon: <Icon name="magicStarFilled" fill="#000000" size={14} />,
    menuItems: [],
    divider: <Divider variant={Variant.Vertical} />,
  },
  {
    id: '3',
    label: 'Events',
    icon: <Icon name="calendarFilledTwo" fill="#000000" size={14} />,
    menuItems: [],
    divider: <Divider variant={Variant.Vertical} />,
  },
  {
    id: '4',
    label: 'Polls',
    icon: <Icon name="chartFilled" fill="#000000" size={14} />,
    menuItems: [],
  },
];

const Feed: React.FC<IFeedProps> = () => {
  const [showModal, setShowModal] = useState(false);
  const { ref, inView } = useInView();

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteFeed();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const feed = data?.pages.flatMap((page) => {
    return page.data?.result?.data.map((post: any) => {
      try {
        return post;
      } catch (e) {
        console.log('Error', { post });
      }
    });
  }) as IGetPost[];

  return (
    <div className="mb-12 flex justify-center">
      <div className="">User card here</div>
      <div className="max-w-2xl">
        <div className="">
          <CreatePostCard setShowModal={setShowModal} />
          {isLoading ? (
            <div>loading...</div>
          ) : (
            <div>
              {feed.map((post) => (
                <Post data={post} key={post.id} />
              ))}
            </div>
          )}

          <div className="h-12 w-12">
            {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
          </div>
          {isFetchingNextPage && <div>Loading more...</div>}
        </div>
      </div>
      <div className="">Announcmeent here</div>
      {/* <ActivityFeed
        activityFeed={feed}
        loadMore={fetchNextPage}
        setShowModal={setShowModal}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
      /> */}
      <PostBuilder showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
};

export default Feed;
