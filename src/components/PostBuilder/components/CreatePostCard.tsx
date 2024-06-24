import { Link } from 'react-router-dom';

// components
import Avatar from 'components/Avatar';
import Card from 'components/Card';
import Icon from 'components/Icon';

// hooks
import useAuth from 'hooks/useAuth';
import { FC, memo } from 'react';
import { useCreatePostUtilityStore } from 'stores/createPostUtilityStore';
import useProduct from 'hooks/useProduct';

export interface ICreatePostCardProps {
  openModal: () => void;
}

const CreatePostCard: FC<ICreatePostCardProps> = ({ openModal }) => {
  const { user } = useAuth();
  const { isLxp } = useProduct();
  const {
    setOpenCreatePostWithMedia,
    setOpenCreatePostWithShoutout,
    setOpenCreatePostWithPolls,
  } = useCreatePostUtilityStore();
  const handleOnClick = (callback: (flag: boolean) => void) => {
    return () => {
      callback(true);
      openModal();
    };
  };
  const postTypeMapIcons = [
    {
      id: 1,
      label: 'Media',
      icon: <Icon name="imageFilled" color="text-neutral-500" size={14} />,
      divider: true,
      onClick: handleOnClick(setOpenCreatePostWithMedia),
    },
    {
      id: 2,
      label: 'Shoutout',
      icon: <Icon name="magicStarFilled" color="text-neutral-500" size={14} />,
      divider: true,
      onClick: handleOnClick(setOpenCreatePostWithShoutout),
    },
    {
      id: 3,
      label: 'Polls',
      icon: <Icon name="chartFilled" color="text-neutral-500" size={14} />,
      onClick: handleOnClick(setOpenCreatePostWithPolls),
    },
  ];
  return (
    <Card className="bg-white px-6 pt-6 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Link to={isLxp ? '' : '/profile'}>
          <Avatar
            size={32}
            name={user?.name}
            active={false}
            image={user?.profileImage}
          />
        </Link>
        <input
          type="input"
          className="w-full h-11 border border-neutral-200 rounded-19xl text-sm font-medium outline-none text-neutral-500 flex-1 px-5 py-3 cursor-pointer hover:bg-neutral-100 focus:bg-neutral-100 transition-colors"
          readOnly
          onKeyUp={(e) => (e.code === 'Enter' ? openModal() : '')}
          onClick={openModal}
          placeholder="What's on your mind?"
          data-testid="activityfeed-whatsonurmind"
          aria-label="create post"
          autoComplete="off"
        />
      </div>
      <div className="flex border-t border-neutral-100 w-full">
        {postTypeMapIcons.map((type, idx) => (
          <div
            key={type.id}
            className={`flex gap-3 items-center py-3 grow justify-center cursor-pointer group outline-none ${
              idx !== postTypeMapIcons.length - 1 && 'border-r'
            }`}
            tabIndex={0}
            role="button"
            title={`create post with ${type.label}`}
            onClick={type.onClick}
            onKeyUp={(e) => (e.code === 'Enter' ? type.onClick() : '')}
          >
            <div className="flex justify-center items-center rounded-7xl border-1 border-neutral-200 bg-neutral-100 p-2">
              {type.icon}
            </div>
            <div className="text-xs font-normal text-neutral-500">
              {type.label}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default memo(CreatePostCard);
