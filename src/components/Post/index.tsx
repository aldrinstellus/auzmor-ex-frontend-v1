import React, { ReactNode, useEffect, useState } from 'react';
import Card from 'components/Card';

import Comments from 'images/comments.svg';

import Actor from 'components/Actor';
import { VIEW_POST } from 'components/Actor/constant';
import Commentspage from 'components/Comments/index';
import { Likes, Reaction } from 'components/Likes';
import { RenderQuillDelta } from 'components/RenderQuillDelta';
import { DeltaStatic } from 'quill';
import { getReactions } from 'queries/reaction';

type PostProps = {
  data: DeltaStatic;
  id: string;
};

const Post: React.FC<PostProps> = (props: PostProps) => {
  const [showComments, setShowComments] = useState(false);
  const [reaction, setReaction] = useState<Reaction>({
    name: 'Like',
  });

  const [comments, setComments] = useState();

  const [reactionId, setReactionId] = useState('');

  const setupReaction = async () => {
    const Reactions = await getReactions(props?.id, 'post');
    setReaction({
      name: Reactions.data.length > 0 ? Reactions.data[0].reaction : 'Like',
    });
    setReactionId(Reactions.data.length > 0 ? Reactions.data[0].id : '');
  };

  const setupComments = async () => {
    const commentsData = await getReactions(props?.id, 'post');
    setComments(commentsData.data);
  };

  useEffect(() => {
    setupReaction();
    setupComments();
  }, []);

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
        <RenderQuillDelta delta={props?.data as DeltaStatic} />
        {/* Media Display */}
        <div></div>
        {/* Reaction and comment repost */}
        <div className="flex justify-between pt-4 pb-6">
          <div className="flex ">
            <Likes
              reaction={reaction}
              setReaction={setReaction}
              entityId={props?.id}
              entityType="post"
              reactionId={reactionId}
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
        {showComments && (
          <Commentspage entityId={props?.id} commentsData={comments} />
        )}
      </div>
    </Card>
  );
};

export default Post;
