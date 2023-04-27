import Avatar from 'components/Avatar';
import Card from 'components/Card';
import React from 'react';
import { postTypeMapIcons } from '..';

export interface ICreatePostCardProps {
  setShowModal: (flag: boolean) => void;
}

const CreatePostCard: React.FC<ICreatePostCardProps> = ({ setShowModal }) => {
  return (
    <Card className="bg-white">
      <div className="flex items-center px-6 pt-6 pb-3">
        <Avatar
          size={32}
          image="https://png.pngtree.com/png-clipart/20210619/ourlarge/pngtree-instagram-lady-social-media-flat-style-avatar-png-image_3483977.jpg"
          name={''}
          active={false}
        />
        {/* replace with component library */}
        <input
          type="input"
          className="w-135.25 h-11 border border-neutral-200 rounded-19xl ml-3 px-5 py-3 text-sm font-medium outline-none"
          readOnly
          onClick={() => setShowModal(true)}
          placeholder="What's on your mind?"
        />
      </div>
      <div className="flex justify-between mx-8.5">
        {postTypeMapIcons.map((type) => (
          <div key={type.id}>
            <div className="flex items-center py-3">{type.icon}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CreatePostCard;
