import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

// components
import Avatar from 'components/Avatar';
import Card from 'components/Card';
import Icon from 'components/Icon';

// types
import { IPostMenu } from './CreatePostModal';

// hooks
import useAuth from 'hooks/useAuth';
import Divider, { Variant } from 'components/Divider';

export interface ICreatePostCardProps {
  openModal: () => void;
}

export const postTypeMapIcons: IPostMenu[] = [
  {
    id: 1,
    label: 'Media',
    icon: (
      <Icon
        name="imageFilled"
        color="!text-neutral-500"
        size={14}
        hover={false}
      />
    ),
    menuItems: [
      {
        renderNode: (
          <div className="flex px-6 py-3 items-center hover:bg-primary-50">
            <Icon
              name="image"
              size={16}
              className="p-2 rounded-7xl border mr-2.5 bg-white"
              color="text-primary-500"
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
              color="text-primary-500"
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
              color="text-primary-500"
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
    id: 2,
    label: 'Shoutout',
    icon: (
      <Icon
        name="magicStarFilled"
        color="!text-neutral-500"
        size={14}
        hover={false}
      />
    ),
    menuItems: [],
    divider: true,
  },
  // {
  //   id: 3,
  //   label: 'Events',
  //   icon: <Icon name="calendarFilledTwo" color="text-neutral-500" size={14} />,
  //   menuItems: [],
  //   divider: true,
  // },
  {
    id: 4,
    label: 'Polls',
    icon: (
      <Icon
        name="chartFilled"
        color="!text-neutral-500"
        size={14}
        hover={false}
      />
    ),
    menuItems: [],
  },
];

const CreatePostCard: React.FC<ICreatePostCardProps> = ({ openModal }) => {
  const { user } = useAuth();

  const tabStyle = (hasDivider = false) =>
    clsx(
      { 'flex justify-center items-center group': true },
      {
        'border-r border-neutral-100': hasDivider && window.innerWidth >= 1480,
      },
      {
        'mx-2 px-4': window.innerWidth >= 1480,
      },
    );

  return (
    <Card className="bg-white px-6 pt-6 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Link to="/profile">
          <Avatar
            size={32}
            name={user?.name}
            active={false}
            image={user?.profileImage}
          />
        </Link>
        <input
          type="input"
          className="w-full h-11 border border-neutral-200 rounded-19xl text-sm font-medium outline-none text-neutral-500 flex-1 px-5 py-3 cursor-pointer hover:bg-neutral-100 transition-colors"
          readOnly
          onClick={openModal}
          placeholder="What's on your mind?"
          data-testid="activityfeed-whatsonurmind"
        />
      </div>
      <div className="flex flex-wrap border-t border-neutral-100 justify-between w-full px-10">
        {postTypeMapIcons.map((type, ind) => (
          <>
            <div key={type.id} className="flex gap-3 items-center py-3">
              <div className="flex justify-center items-center rounded-7xl border-1 border-neutral-200 bg-neutral-100 p-2">
                {type.icon}
              </div>
              <div className="text-xs font-normal text-neutral-500">
                {type.label}
              </div>
            </div>

            {ind !== postTypeMapIcons.length - 1 && (
              <Divider className="w-1 h-auto" variant={Variant.Vertical} />
            )}
          </>
        ))}
      </div>
    </Card>
  );
};

export default React.memo(CreatePostCard);
