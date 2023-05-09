import React from 'react';
import Avatar from 'components/Avatar';
import Earth from 'images/earth.svg';
import { CREATE_POST, VIEW_POST } from './constant';
import useAuth from 'hooks/useAuth';

type ActorProps = {
  visibility: string;
  contentMode?: string;
  createdTime?: string;
  createdBy?: string;
};

const Actor: React.FC<ActorProps> = ({
  visibility,
  contentMode,
  createdTime,
  createdBy,
}) => {
  const { user } = useAuth();

  return (
    <div className={`flex justify-between items-center mx-6 mt-6 mb-4`}>
      <div className="flex items-center">
        <div>
          <Avatar name={createdBy || user?.name || 'U'} size={32} />
        </div>
        <div className="ml-3">
          <div className="font-bold text-sm text-neutral-900">
            {createdBy}
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
        {contentMode === CREATE_POST && (
          <div className="flex justify-between items-center border border-neutral-300 rounded-17xl py-1.5 px-3">
            <div>
              <img src={Earth} height={13.33} width={13.33} />
            </div>
            <div className="cursor-pointer text-xxs text-neutral-900 font-medium ml-1.5">
              {visibility}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Actor;
