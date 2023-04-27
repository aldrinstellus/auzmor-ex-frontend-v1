import React, { ReactNode, useState } from 'react';
import { DeltaStatic } from 'quill';
import ActivityFeed from 'components/ActivityFeed';
import CreatePostCard from './components/CreatePostCard';
import Icon from 'components/Icon';
import CreatePostModal from './components/CreatePostModal';

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
  },
  {
    id: 2,
    label: 'Shoutout',
    icon: <Icon name="magicStarFilled" fill="#000000" size={14} />,
  },
  {
    id: 3,
    label: 'Events',
    icon: <Icon name="calendarFilledTwo" fill="#000000" size={14} />,
  },
  {
    id: 4,
    label: 'Polls',
    icon: <Icon name="chartFilled" fill="#000000" size={14} />,
  },
];

const Feed: React.FC<IFeedProps> = () => {
  const [showModal, setShowModal] = useState(true);
  return (
    <div className="flex flex-col">
      <CreatePostCard setShowModal={setShowModal} />
      <ActivityFeed activityFeed={[]} />
      <CreatePostModal showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
};

export default Feed;
