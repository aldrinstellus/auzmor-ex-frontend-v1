import React from 'react';
import Avatar from 'components/Avatar';
import Earth from 'images/earth.svg';
import Ellipsis from 'images/ellipsis.svg';
import { CREATE_POST, VIEW_POST } from './constant';

type ActorProps = {
  avatar: string;
  actorName: string;
  visibility: string;
  contentMode?: string;
  createdTime?: string;
};

const Actor: React.FC<ActorProps> = ({
  avatar,
  actorName,
  visibility,
  contentMode,
  createdTime,
}) => {
  return (
    <div className={`flex justify-between items-center mx-6 mt-6 mb-4`}>
      <div className="flex items-center">
        <div>
          <Avatar size={32} image={avatar} name={actorName} active={false} />
        </div>
        <div className="ml-3">
          <div className="font-bold text-sm text-neutral-900">
            {actorName}
            {contentMode === VIEW_POST ? (
              <span className="ml-1 text-sm font-normal text-neutral-900">
                shared a post
              </span>
            ) : null}
          </div>
          {contentMode === VIEW_POST ? (
            <div className="flex">
              <div className="text-xs font-normal text-neutral-500 mr-4">
                {createdTime}
              </div>
              <img src={Earth} width={13.33} height={13.33} />
            </div>
          ) : null}
        </div>
      </div>
      {/* post visibility - dropdown */}
      <div>
        {contentMode === CREATE_POST ? (
          <div className="flex justify-between items-center border border-neutral-300 rounded-17xl py-1.5 px-3">
            <div>
              <img src={Earth} height={13.33} width={13.33} />
            </div>
            <div className="cursor-pointer text-xxs text-neutral-900 font-medium ml-1.5">
              {visibility}
            </div>
          </div>
        ) : (
          <div>
            <img src={Ellipsis} width={18} height={4} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Actor;
