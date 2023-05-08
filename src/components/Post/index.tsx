import React, { useState } from 'react';
import Card from 'components/Card';
import Comments from 'images/comments.svg';
import Actor from 'components/Actor';
import { VIEW_POST } from 'components/Actor/constant';
import CommentCard from 'components/Comments/index';
import Likes, { ReactionType } from 'components/Reactions';
import { RenderPost } from 'components/RenderPost';
import { DeltaStatic } from 'quill';
import FeedPostMenu from './components/FeedPostMenu';
import { announcementRead, IPost, IGetPost } from 'queries/post';
import Icon from 'components/Icon';
import Button, { Size, Variant } from 'components/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import IconButton, {
  Variant as IconVariant,
  Size as SizeVariant,
} from 'components/IconButton';
import clsx from 'clsx';
import { humanizeTime } from 'utils/time';

export const iconsStyle = (key: string) => {
  const iconStyle = clsx(
    {
      'bg-indigo-100': key === ReactionType.Like,
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
};

const Post: React.FC<PostProps> = ({ data }) => {
  const [showComments, setShowComments] = useState(false);

  const reaction = data?.myReaction?.reaction;
  const reactionId = data?.myReaction?.id;

  const content: DeltaStatic = data?.content?.editor;
  const keys = Object.keys(data.reactionsCount).length;
  const totalCount = Object.values(data.reactionsCount).reduce(
    (total, count) => total + count,
    0,
  );

  const queryClient = useQueryClient();

  const isAnnouncement = data?.isAnnouncement;

  const acknowledgeAnnouncement = useMutation({
    mutationKey: ['acknowledgeAnnouncement'],
    mutationFn: announcementRead,
    onError: (error) => console.log(error),
    onSuccess: async (data, variables, context) => {
      console.log('data==>', data);
      await queryClient.invalidateQueries(['acknowledgeAnnouncement']);
    },
  });

  return (
    <Card>
      <div>
        {isAnnouncement &&
          !(data?.myAcknowledgement?.reaction === 'mark_read') && (
            <div className="flex justify-between items-center bg-blue-700 -mb-4 p-2 rounded-t-9xl">
              <div className="flex justify-center items-center text-white text-xs font-bold space-x-4">
                <div>
                  <Icon name="flashIcon" />
                </div>
                <div className="text-xs font-bold">Announcement</div>
              </div>
              <Button
                className="text-sm font-bold"
                label={'Mark as read'}
                size={Size.Small}
                variant={Variant.Tertiary}
                onClick={() => {
                  acknowledgeAnnouncement.mutate({
                    entityId: data?.id,
                    entityType: 'post',
                    type: 'acknowledge',
                    reaction: 'mark_read',
                  });
                }}
              />
            </div>
          )}
      </div>
      <div className="flex justify-between items-center">
        <Actor
          visibility="Everyone"
          contentMode={VIEW_POST}
          createdTime={humanizeTime(data?.createdAt)}
          createdBy={data?.createdBy?.fullName}
        />
        <div className="relative">
          <FeedPostMenu data={data as unknown as IPost} /> {/* Temp fix */}
        </div>
      </div>
      <div className="mx-6">
        {/* Post Content */}
        <RenderPost data={data} />
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
                      className={`!p-1 rounded-17xl ${
                        i > 0 ? '-ml-2 z-1' : ''
                      } ${iconsStyle(key)} hover:${iconsStyle(key)} `}
                      variant={IconVariant.Primary}
                    />
                  ))}
              </div>
            )}

            <div className={`flex text-sm font-normal text-neutral-500 mt-0.5`}>
              {totalCount} reacted
            </div>
          </div>

          <div className="flex flex-row text-sm font-normal text-neutral-500 space-x-7 items-center">
            <div>{data.commentsCount || 0} Comments</div>
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
        {/* Comments */}
        {showComments && <CommentCard entityId={data?.id || ''} />}
      </div>
    </Card>
  );
};

export default Post;
