import Avatar from 'components/Avatar';
import Card from 'components/Card';
import Divider from 'components/Divider';
import useAuth from 'hooks/useAuth';
import React, { ReactNode } from 'react';
import { IMenuItem } from 'components/PopupMenu';
import Icon from 'components/Icon';
import { twConfig } from 'utils/misc';
import clsx from 'clsx';

export interface ICreatePostCardProps {
  setShowModal: (flag: boolean) => void;
}

export interface IPostTypeIcon {
  id: string;
  label: string;
  icon: ReactNode;
  menuItems: IMenuItem[];
  divider?: boolean;
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
    divider: true,
  },
  {
    id: '2',
    label: 'Shoutout',
    icon: <Icon name="magicStarFilled" fill="#000000" size={14} />,
    menuItems: [],
    divider: true,
  },
  {
    id: '3',
    label: 'Events',
    icon: <Icon name="calendarFilledTwo" fill="#000000" size={14} />,
    menuItems: [],
    divider: true,
  },
  {
    id: '4',
    label: 'Polls',
    icon: <Icon name="chartFilled" fill="#000000" size={14} />,
    menuItems: [],
  },
];

const CreatePostCard: React.FC<ICreatePostCardProps> = ({ setShowModal }) => {
  const { user } = useAuth();

  const tabStyle = (hasDivider = false) =>
    clsx(
      { 'flex justify-center items-center mx-2 px-4': true },
      { 'border-r border-neutral-100': hasDivider },
    );

  return (
    <Card className="bg-white px-2">
      <div className="flex items-center px-4 pt-6 pb-4">
        <Avatar size={32} name={user?.name} active={false} />
        {/* replace with component library */}
        <input
          type="input"
          className="w-full h-11 border border-neutral-200 rounded-19xl ml-3 px-5 py-3 text-sm font-medium outline-none text-neutral-500"
          readOnly
          onClick={() => setShowModal(true)}
          placeholder="What's on your mind?"
        />
      </div>
      <div className="flex justify-between border-t border-neutral-100 mx-8.5">
        {postTypeMapIcons.map((type) => (
          <div key={type.id} className={tabStyle(type.divider)}>
            <div className="mt-3 mb-3 flex justify-center items-center py-3 rounded-7xl border-1 border-neutral-200 bg-neutral-200 w-8 h-8">
              {type.icon}
            </div>
            <div className="ml-3">{type.label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CreatePostCard;
