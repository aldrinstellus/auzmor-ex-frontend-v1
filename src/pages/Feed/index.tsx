import React, { ReactNode, useState } from 'react';
import { DeltaStatic } from 'quill';
import ActivityFeed from 'components/ActivityFeed';
import CreatePostCard from './components/CreatePostCard';
import Icon from 'components/Icon';
import CreatePostModal from './components/CreatePostModal';
import { IMenuItem } from 'components/PopupMenu';
import { twConfig } from 'utils/misc';
import { useLoaderData } from 'react-router-dom';

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
              size={16}
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
  },
  {
    id: 2,
    label: 'Shoutout',
    icon: <Icon name="magicStarFilled" fill="#000000" size={14} />,
    menuItems: [],
  },
  {
    id: 3,
    label: 'Events',
    icon: <Icon name="calendarFilledTwo" fill="#000000" size={14} />,
    menuItems: [],
  },
  {
    id: 4,
    label: 'Polls',
    icon: <Icon name="chartFilled" fill="#000000" size={14} />,
    menuItems: [],
  },
];

const Feed: React.FC<IFeedProps> = () => {
  const [showModal, setShowModal] = useState(true);
  const rawFeedData: any = useLoaderData();
  const feed: IFeed[] = rawFeedData.data.map((data: any) => {
    return {
      content: {
        ...data.content,
        editor: JSON.parse(data.content.editor),
      },
      uuid: data.uuid,
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
      <CreatePostModal showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
};

export default Feed;
