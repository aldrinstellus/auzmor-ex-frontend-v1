import Avatar from 'components/Avatar';
import Card from 'components/Card';
import Divider from 'components/Divider';
import React from 'react';
import { postTypeMapIcons } from '../../../pages/Feed';

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
          name={'Anish Sarkar'}
          active={false}
        />
        {/* replace with component library */}
        <input
          type="input"
          className="w-135.25 h-11 border border-neutral-200 rounded-19xl ml-3 px-5 py-3 text-sm font-medium outline-none text-neutral-500"
          readOnly
          onClick={() => setShowModal(true)}
          placeholder="What's on your mind?"
        />
      </div>
      <Divider className="flex justify-center items-center " />
      <div className="flex justify-between mx-8.5">
        {postTypeMapIcons.map((type) => (
          <div key={type.id} className="flex justify-center items-center">
            <div className="mt-3 mb-3 flex justify-center items-center py-3 rounded-7xl border-1 border-neutral-200 bg-neutral-200 w-8 h-8">
              {type.icon}
            </div>
            <div className="mr-10 ml-3">{type.label}</div>
            {type.divider}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CreatePostCard;
