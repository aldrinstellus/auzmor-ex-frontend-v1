import React, { useState } from 'react';
import Card from 'components/Card';
import Comments from 'images/comments.svg';
import Actor from 'components/Actor';
import { VIEW_POST } from 'components/Actor/constant';
import CommentCard from 'components/Comments/index';
import Likes, { ReactionType } from 'components/Reactions';
import { RenderQuillDelta } from 'components/RenderQuillDelta';
import { DeltaStatic } from 'quill';
import FeedPostMenu from './components/FeedPostMenu';
import { IGetPost } from 'queries/post';
import IconButton, {
  Variant as IconVariant,
  Size as SizeVariant,
} from 'components/IconButton';
import clsx from 'clsx';

type PostProps = {
  data: IGetPost;
};

export const iconsStyle = (key: string) => {
  const iconStyle = clsx(
    {
      'bg-blue-100': key === ReactionType.Like,
    },

    {
      'bg-red-100': key === ReactionType.Support,
    },
    {
      'bg-yellow-100': key === ReactionType.Celebrate,
    },
    {
      'bg-red-100': key === ReactionType.Love,
    },
    {
      'bg-amber-100': key === ReactionType.Funny,
    },
    {
      'bg-yellow-100': key === ReactionType.Insightful,
    },
  );

  return iconStyle;
};

const Post: React.FC<PostProps> = ({ data }) => {
  const [showComments, setShowComments] = useState(false);

  const reaction = data?.myReactions?.[0]?.reaction;
  const reactionId = data?.myReactions?.[0]?.id;

  const content: DeltaStatic = data?.content?.editor;
  const keys = Object.keys(data.reactionsCount).length;
  const totalCount = Object.values(data.reactionsCount).reduce(
    (total, count) => total + count,
    0,
  );

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

        <div className="border-b border-neutral-100 mt-4"></div>
        <div className="flex flex-row justify-between my-3">
          <div className={`flex flex-row`}>
            {keys > 0 && (
              <div className="mr-2">
                {Object.keys(data.reactionsCount)
                  .slice(0, 3)
                  .map((key, i) => (
                    <IconButton
                      icon={key}
                      size={SizeVariant.Small}
                      key={key}
                      className={`!p-1 rounded-17xl  ${iconsStyle(
                        key,
                      )} hover:${iconsStyle(key)} `}
                      variant={IconVariant.Primary}
                    />
                  ))}
              </div>
            )}

            <div className={`flex text-sm font-normal text-neutral-500 mt-1  `}>
              {totalCount} reacted
            </div>
          </div>

          <div className="flex flex-row text-sm font-normal text-neutral-500 space-x-7 items-center">
            <div>{data.commentsCount || 0} Comments</div>
            <div>0 reposts</div>
          </div>
        </div>

        <div className="border-b border-neutral-100"></div>

        <div className="flex justify-between pt-4 pb-6">
          <div className="flex ">
            <Likes
              reaction={reaction || ''}
              entityId={data?.id || ''}
              entityType="post"
              reactionId={reactionId || ''}
              queryKey="feed"
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
        {showComments && <CommentCard entityId={data?.id || ''} />}
      </div>
    </Card>
  );
};

export default Post;
