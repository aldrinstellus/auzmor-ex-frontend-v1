import React, { ReactNode, useState } from 'react';
import { Card } from '@auzmorui/component-library.components.card';
import Like from 'images/like.svg';

import Comments from 'images/comments.svg';

import Actor from 'components/Actor';
import { VIEW_POST } from 'components/Actor/constant';
import Commentspage from 'components/Comments/index';
import { Likes } from 'components/Likes';

type PostProps = {
  content: any;
};

const Post: React.FC<PostProps> = ({ content }) => {
  const [showComments, setShowComments] = useState(false);
  const [name, setName] = useState<string>('Like');
  const [likeIcon, setLikeIcon] = useState<string>(Like);
  const [likeButtonColor, setLikeButtonColor] =
    useState<string>('text-neutral-500');

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
          <div className="flex ">
            <Likes
              name={name}
              setName={setName}
              setLikeIcon={setLikeIcon}
              likeIcon={likeIcon}
              setLikeButtonColor={setLikeButtonColor}
              likeButtonColor={likeButtonColor}
            />

            <button className="flex items-center ml-7">
              <img src={Comments} height={13.33} width={13.33} />
              <div
                className="text-xs font-normal text-neutral-500 ml-1.5"
                onClick={() => {
                  if (showComments) {
                    setShowComments(false);
                  } else {
                    setShowComments(true);
                  }
                }}
              >
                Comment
              </div>
            </button>
          </div>
          <div></div>
        </div>
        {showComments && <Commentspage />}
      </div>
    </Card>
  );
};

export default Post;
