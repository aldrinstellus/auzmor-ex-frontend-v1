import React, { ReactNode } from 'react';
import { Card } from '@auzmorui/component-library.components.card';
import Like from 'images/like.svg';
import Comments from 'images/comments.svg';
import Actor from 'components/Actor';
import { VIEW_POST } from 'components/Actor/constant';

type PostProps = {
  content: any;
};

const Post: React.FC<PostProps> = ({ content }) => {
  return (
    <Card className="bg-white rounded-9xl mt-5">
      <Actor
        avatar="https://png.pngtree.com/png-clipart/20210619/ourlarge/pngtree-instagram-lady-social-media-flat-style-avatar-png-image_3483977.jpg"
        actorName="Sam Fields"
        visibility="Everyone"
        contentMode={VIEW_POST}
        createdTime="10 mins ago"
      />
      <div className="mx-6">
        {/* Post Content */}
        <div dangerouslySetInnerHTML={{ __html: content }} />
        {/* Media Display */}
        <div></div>
        {/* Reaction and comment repost */}
        <div className="flex justify-between pt-4 pb-6">
          <div className="flex">
            <button className="flex items-center">
              <img src={Like} height={13.33} width={13.33} />
              <div className="text-xs font-normal text-neutral-500 ml-1.5">
                Like
              </div>
            </button>
            <button className="flex items-center ml-7">
              <img src={Comments} height={13.33} width={13.33} />
              <div className="text-xs font-normal text-neutral-500 ml-1.5">
                Comment
              </div>
            </button>
          </div>
          <div></div>
        </div>
      </div>
    </Card>
  );
};

export default Post;
