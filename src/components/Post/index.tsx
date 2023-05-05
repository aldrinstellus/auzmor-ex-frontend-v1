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
import clsx from 'clsx';
import { announcementRead, IPost } from 'queries/post';
import Icon from 'components/Icon';
import Button, { Size, Variant } from 'components/Button';
import { useMutation } from '@tanstack/react-query';

type PostProps = {
  className?: string;
  data: IPost;
};

const Post: React.FC<PostProps> = ({ data, className = '' }) => {
  const [showComments, setShowComments] = useState(false);
  const [name, setName] = useState<string>('Like');
  const [likeIcon, setLikeIcon] = useState<string>(Like);
  const [likeButtonColor, setLikeButtonColor] =
    useState<string>('text-neutral-500');

  const content: DeltaStatic = data?.content?.editor;

  const isAnnouncement = data?.isAnnouncement;

  const acknowledgeAnnouncement = useMutation({
    mutationKey: ['acknowledgeAnnouncement'],
    mutationFn: announcementRead,
    onError: (error) => console.log(error),
    onSuccess: (data, variables, context) => {
      console.log('data==>', data);
    },
  });

  return (
    <Card>
      <div>
        {isAnnouncement &&
          !data?.myReactions?.some(
            (reaction) => reaction.reaction === 'mark_read',
          ) && (
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
        <Actor visibility="Everyone" contentMode={VIEW_POST} createdTime={''} />
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
