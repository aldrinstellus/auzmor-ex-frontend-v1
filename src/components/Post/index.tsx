import React, { ReactNode, useEffect, useRef, useState } from 'react';
import Card from 'components/Card';
import Comments from 'images/comments.svg';
import Actor from 'components/Actor';
import { VIEW_POST } from 'components/Actor/constant';
import CommentCard from 'components/Comments/index';
import Likes, { ReactionType } from 'components/Reactions';
import { RenderPost } from 'components/RenderPost';
import { DeltaStatic } from 'quill';
import FeedPostMenu from './components/FeedPostMenu';
import { IPost, IGetPost } from 'queries/post';
import Icon from 'components/Icon';
import clsx from 'clsx';
import { humanizeTime } from 'utils/time';
import AcknowledgementBanner from './components/AcknowledgementBanner';
import ReactionModal from './components/ReactionModal';

export const iconsStyle = (key: string) => {
  const iconStyle = clsx(
    {
      'bg-blue-300': key === ReactionType.Like,
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
      'bg-yellow-100': key === ReactionType.Funny,
    },
    {
      'bg-yellow-100': key === ReactionType.Insightful,
    },
  );

  return iconStyle;
};

type PostProps = {
  // data: IPost;
  data: IGetPost;
  customNode?: ReactNode;
};

const Post: React.FC<PostProps> = ({ data, customNode = null }) => {
  const [showComments, setShowComments] = useState(false);
  const [showReactionModal, setShowReactionModal] = useState(false);

  const reaction = data?.myReaction?.reaction;
  const reactionId = data?.myReaction?.id;

  const keys = Object.keys(data.reactionsCount).length;
  const totalCount = Object.values(data.reactionsCount).reduce(
    (total, count) => total + count,
    0,
  );

  const previousShowComment = useRef<boolean>(false);

  useEffect(() => {
    if (showComments) {
      previousShowComment.current = true;
    }
  }, [showComments]);

  return (
    <>
      <Card className="mb-4">
        <AcknowledgementBanner data={data} />
        <div className="flex justify-between items-center">
          <Actor
            visibility="Everyone"
            contentMode={VIEW_POST}
            createdTime={humanizeTime(data?.createdAt)}
            createdBy={data?.createdBy}
          />
          <div className="relative">
            <FeedPostMenu data={data as unknown as IPost} /> {/* Temp fix */}
          </div>
        </div>
        <div className="mx-6">
          <RenderPost data={data} />
          <div className="border-b border-neutral-100 mt-4"></div>
          <div className="flex flex-row justify-between my-3">
            <div className={`flex flex-row`}>
              {keys > 0 && (
                <div className="flex flex-row mr-2">
                  {Object.keys(data.reactionsCount)
                    .slice(0, 3)
                    .map((key, i) => (
                      <div
                        className={` ${i > 0 ? '-ml-2 z-1' : ''}  `}
                        key={key}
                      >
                        <Icon
                          name={key}
                          size={12}
                          className={`p-0.5 rounded-17xl cursor-pointer border-white border border-solid ${iconsStyle(
                            key,
                          )}`}
                        />
                      </div>
                    ))}
                </div>
              )}

              <div
                className={`flex text-sm font-normal text-neutral-500 cursor-pointer`}
                onClick={() => setShowReactionModal(true)}
              >
                {totalCount} reacted
              </div>
            </div>

            <div className="flex flex-row text-sm font-normal text-neutral-500 space-x-7 items-center cursor-pointer">
              <div
                onClick={() => {
                  if (showComments) {
                    setShowComments(false);
                  } else {
                    setShowComments(true);
                  }
                }}
              >
                {data.commentsCount || 0} Comments
              </div>
              <div>0 reposts</div>
            </div>
          </div>

          <div className="border-b border-neutral-100 mt-3"></div>

          <div className="flex justify-between pt-4 pb-6">
            <div className="flex ">
              <Likes
                reaction={reaction || ''}
                entityId={data?.id || ''}
                entityType="post"
                reactionId={reactionId || ''}
                queryKey="feed"
              />

              <button
                className="flex items-center ml-7"
                onClick={() => {
                  if (showComments) {
                    setShowComments(false);
                  } else {
                    setShowComments(true);
                  }
                }}
              >
                <img src={Comments} height={13.33} width={13.33} />
                <div className="text-xs font-normal text-neutral-500 ml-1.5">
                  Comment
                </div>
              </button>
            </div>
            <div></div>
          </div>
          {/* Comments */}
          {showComments ? (
            <CommentCard entityId={data?.id || ''} />
          ) : (
            !previousShowComment.current && customNode
          )}
        </div>
      </Card>
      {showReactionModal && (
        <ReactionModal
          closeModal={() => setShowReactionModal(false)}
          reactionCounts={data.reactionsCount}
          postId={data.id}
        />
      )}
    </>
  );
};

export default Post;
