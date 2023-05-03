import React, { ReactNode, useEffect, useState } from 'react';
import Card from 'components/Card';

import Comments from 'images/comments.svg';

import Actor from 'components/Actor';
import { VIEW_POST } from 'components/Actor/constant';
import Commentspage from 'components/Comments/index';
import { Likes } from 'components/Reactions';
import { RenderQuillDelta } from 'components/RenderQuillDelta';
import { DeltaStatic } from 'quill';
import { getReactions } from 'queries/reaction';
import { useMutation } from '@tanstack/react-query';
import FeedPostMenu from './components/FeedPostMenu';

type PostProps = {
  data: Record<string, any>;
  id: string;
};

const Post: React.FC<PostProps> = ({ data, id }) => {
  const [showComments, setShowComments] = useState(false);
  const [reaction, setReaction] = useState<string>('Like');

  const [comments, setComments] = useState({});

  const [reactionId, setReactionId] = useState('');

  const getReactionsMutation = useMutation({
    mutationKey: ['get-reactions-mutation'],
    mutationFn: getReactions,
    onError: (error: any) => {
      console.log(error);
    },
    onSuccess: (data: any, variables, context) => {
      setReaction(data.data.length > 0 ? data.data[0].reaction : 'Like');
      setReactionId(data.data.length > 0 ? data.data[0].id : '');
    },
  });

  const setupReaction = async () => {
    const data = {
      entityId: id,
      entityType: 'post',
    };

    getReactionsMutation.mutate(data);
  };

  useEffect(() => {
    setupReaction();
  }, []);

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
              reaction={reaction}
              entityId={id}
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
        {showComments && <Commentspage entityId={id} commentsData={comments} />}
      </div>
    </Card>
  );
};

export default Post;
