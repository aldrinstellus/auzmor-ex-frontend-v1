import React, { ReactNode, useState } from 'react';
import Like from 'images/like.svg';
import Card from 'components/Card';

import Comments from 'images/comments.svg';

import Actor from 'components/Actor';
import { VIEW_POST } from 'components/Actor/constant';
import Commentspage from 'components/Comments/index';
import { Likes } from 'components/Likes';
import { RenderQuillDelta } from 'components/RenderQuillDelta';
import { DeltaStatic } from 'quill';
import FeedPostMenu from './components/FeedPostMenu';
import { IPost } from 'queries/post';

type PostProps = {
  data: IPost;
};

const Post: React.FC<PostProps> = ({ data }) => {
  const [showComments, setShowComments] = useState(false);
  const [name, setName] = useState<string>('Like');
  const [likeIcon, setLikeIcon] = useState<string>(Like);
  const [likeButtonColor, setLikeButtonColor] =
    useState<string>('text-neutral-500');

  const content: DeltaStatic = data?.content?.editor;

  return (
    <Card className="mt-5">
      <div className="flex justify-between items-center">
        <Actor
          visibility="Everyone"
          contentMode={VIEW_POST}
          createdTime="10 mins ago"
        />
        <div className="relative">
          <FeedPostMenu data={data} />
        </div>
      </div>
      <div className="mx-6">
        {/* Post Content */}
        <RenderQuillDelta delta={content} />
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
