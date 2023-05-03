import React, { ReactNode, useState } from 'react';
import { DeltaStatic } from 'quill';
import ActivityFeed from 'components/ActivityFeed';
import CreatePostCard from '../../components/PostBuilder/components/CreatePostCard';
import Icon from 'components/Icon';
import CreatePostModal from '../../components/PostBuilder/components/CreatePostModal';
import { IMenuItem } from 'components/PopupMenu';
import { twConfig } from 'utils/misc';
import { useLoaderData } from 'react-router-dom';
import Divider, { Variant } from 'components/Divider';
import CreatePostProvider from 'contexts/CreatePostContext';
import PostBuilder from 'components/PostBuilder';

interface IFeedProps {}

interface IContent {
  text: string;
  html: string;
  editor: DeltaStatic;
}

export interface IPostTypeIcon {
  id: number;
  label: string;
  icon: ReactNode;
  menuItems: IMenuItem[];
  divider?: ReactNode;
}
export interface IFeed {
  content: IContent;
  uuid: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  isAnnouncement: boolean;
}

export const postTypeMapIcons: IPostTypeIcon[] = [
  {
    id: 1,
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
    id: 2,
    label: 'Shoutout',
    icon: <Icon name="magicStarFilled" fill="#000000" size={14} />,
    menuItems: [],
    divider: <Divider variant={Variant.Vertical} />,
  },
  {
    id: 3,
    label: 'Events',
    icon: <Icon name="calendarFilledTwo" fill="#000000" size={14} />,
    menuItems: [],
    divider: <Divider variant={Variant.Vertical} />,
  },
  {
    id: 4,
    label: 'Polls',
    icon: <Icon name="chartFilled" fill="#000000" size={14} />,
    menuItems: [],
  },
];

const Feed: React.FC<IFeedProps> = () => {
  const [showModal, setShowModal] = useState(false);
  const rawFeedData: any = useLoaderData();
  const feed: IFeed[] = rawFeedData.data.map((data: any) => {
    return {
      content: {
        ...data.content,
        editor: JSON.parse(data.content.editor),
      },
      uuid: data.id,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      type: data.type,
      isAnnouncement: data.isAnnouncement,
    } as IFeed;
  });

  return (
    <div className="flex flex-col">
      <CreatePostCard setShowModal={setShowModal} />
      <ActivityFeed activityFeed={feed} />
      <PostBuilder showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
};

export default Feed;
