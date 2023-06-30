import React, { ReactNode, useEffect, useRef, useState } from 'react';
import Card from 'components/Card';
import Actor from 'components/Actor';
import { VIEW_POST } from 'components/Actor/constant';
import CommentCard from 'components/Comments/index';
import Likes, { ReactionType } from 'components/Reactions';
import FeedPostMenu from './components/FeedPostMenu';
import { IPost } from 'queries/post';
import Icon from 'components/Icon';
import clsx from 'clsx';
import { humanizeTime } from 'utils/time';
import AcknowledgementBanner from './components/AcknowledgementBanner';
import ReactionModal from './components/ReactionModal';
import RenderQuillContent from 'components/RenderQuillContent';
import { getNouns } from 'utils/misc';
import Divider from 'components/Divider';

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
  post: IPost;
  customNode?: ReactNode;
};

const Post: React.FC<PostProps> = ({ post, customNode = null }) => {
  const [showComments, setShowComments] = useState(false);
  const [showReactionModal, setShowReactionModal] = useState(false);

  const reaction = post?.myReaction?.reaction;

  const totalCount = Object.values(post.reactionsCount || {}).reduce(
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
        <AcknowledgementBanner data={post} />
        <div className="flex justify-between items-center">
          <Actor
            visibility="Everyone"
            contentMode={VIEW_POST}
            createdTime={humanizeTime(post.createdAt!)}
            createdBy={post?.createdBy}
          />
          <div className="relative">
            <FeedPostMenu data={post as unknown as IPost} /> {/* Temp fix */}
          </div>
        </div>
        <div className="mx-6">
          <RenderQuillContent data={post} />
          {(totalCount > 0 || post?.commentsCount > 0) && (
            <>
              <Divider className="mt-4" />
              <div className="flex flex-row justify-between my-3">
                <div
                  className={`flex flex-row`}
                  data-testid="feed-post-reactioncount"
                >
                  {totalCount > 0 && (
                    <div className="flex flex-row mr-2">
                      {Object.keys(post.reactionsCount)
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
                  {totalCount > 0 && (
                    <div
                      className={`flex text-sm font-normal text-neutral-500 cursor-pointer`}
                      onClick={() => setShowReactionModal(true)}
                    >
                      {totalCount} reacted
                    </div>
                  )}
                </div>
                {post?.commentsCount > 0 && (
                  <div className="flex flex-row text-sm font-normal text-neutral-500 space-x-7 items-center cursor-pointer">
                    <div
                      onClick={() => {
                        if (showComments) {
                          setShowComments(false);
                        } else {
                          setShowComments(true);
                        }
                      }}
                      data-testid="feed-post-commentscount"
                    >
                      {post.commentsCount || 0}{' '}
                      {getNouns('comment', post?.commentsCount || 0)}
                    </div>
                    {/* <div data-testid="feed-post-repostcount">0 reposts</div> */}
                  </div>
                )}
              </div>
              <Divider className="mt-3" />
            </>
          )}
          <div className="flex justify-between pt-4 pb-6">
            <div className="flex ">
              <Likes
                reaction={reaction || ''}
                entityId={post?.id || ''}
                entityType="post"
                reactionId={post?.myReaction?.id || ''}
                queryKey="feed"
                dataTestIdPrefix="post-reaction"
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
                data-testid="feed-post-comment"
              >
                {/* comments..... */}
                <Icon name="comment" size={16} />
                <div className="text-xs font-normal text-neutral-500 ml-1.5">
                  Comment
                </div>
              </button>
            </div>
            <div></div>
          </div>
          {/* Comments */}
          {showComments ? (
            <CommentCard entityId={post?.id || ''} />
          ) : (
            !previousShowComment.current && customNode
          )}
        </div>
      </Card>
      {showReactionModal && (
        <ReactionModal
          closeModal={() => setShowReactionModal(false)}
          reactionCounts={post.reactionsCount}
          postId={post!.id!}
          entityType="post"
        />
      )}
    </>
  );
};

export default Post;
