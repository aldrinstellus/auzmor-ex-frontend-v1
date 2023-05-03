import React, { Dispatch, SetStateAction } from 'react';
import BlueLike from 'images/Like.png';
import Like from 'images/like.svg';
import Love from 'images/Love.png';
import Celebrate from 'images/Celebrate.png';
import Support from 'images/Support.png';
import Laugh from 'images/Laugh.png';
import Insightful from 'images/Insightful.png';
import { useMutation } from '@tanstack/react-query';
import { inviteUsers } from 'queries/users';
import { createReaction, deleteReaction } from 'queries/reaction';
import clsx from 'clsx';

export interface Reaction {
  name: string;
}

interface LikesProps {
  reaction: Reaction;
  setReaction: Dispatch<SetStateAction<Reaction>>;
  entityId: string;
  entityType: string;
  reactionId: string;
}

export const Likes: React.FC<LikesProps> = ({
  reaction,
  setReaction,
  entityId,
  entityType,
  reactionId,
}) => {
  const name = clsx(
    {
      ' Like': reaction.name === 'like',
    },
    {
      ' Like': reaction.name === 'Like',
    },
    {
      ' Love': reaction.name === 'love',
    },
    {
      ' Celebrate': reaction.name === 'celebrate',
    },
    {
      ' Support': reaction.name === 'support',
    },
    {
      ' Funny': reaction.name === 'funny',
    },
    {
      ' Insightful': reaction.name === 'insightful',
    },
  );

  const nameStyle = clsx(
    {
      'text-[#173E90]': reaction.name === 'like',
    },
    {
      'text-neutral-500': reaction.name === 'Like',
    },
    {
      'text-[#F96B40]': reaction.name === 'love',
    },
    {
      'text-yellow-500': reaction.name === 'celebrate',
    },
    {
      'text-red-500': reaction.name === 'support',
    },
    {
      'text-yellow-500': reaction.name === 'funny',
    },
    {
      'text-yellow-500': reaction.name === 'insightful',
    },
  );

  const nameIcon = clsx(
    {
      [BlueLike]: reaction.name === 'like',
    },
    {
      [Like]: reaction.name === 'Like',
    },
    {
      [Love]: reaction.name === 'love',
    },
    {
      [Celebrate]: reaction.name === 'celebrate',
    },
    {
      [Support]: reaction.name === 'support',
    },
    {
      [Laugh]: reaction.name === 'funny',
    },
    {
      [Insightful]: reaction.name === 'insightful',
    },
  );

  const createReactionMutation = useMutation({
    mutationKey: ['createReactionMutation'],
    mutationFn: createReaction,
    onError: (error: any) => {
      console.log(error);
    },
    onSuccess: (data: any, variables, context) => {
      // queryClient.invalidateQueries({ queryKey: ['users'] });
      console.log(data);
    },
  });

  // const deleteReactionMutation = useMutation({
  //   mutationKey: ['delete-reaction', reactionId],
  //   mutationFn: deleteReaction,
  //   onError: (error: any) => {
  //     console.log(error);
  //   },
  //   onSuccess: (data: any, variables: any, context: any) => {
  //     //  queryClient.invalidateQueries({ queryKey: ['users'] });
  //   },
  // });

  const submitReaction = (type: string) => {
    const data = {
      entityId: entityId,
      entityType: entityType,
      type: type,
    };

    createReactionMutation.mutate(data);
  };

  const IdeleteReaction = () => {
    const data = {
      id: reactionId,
      entityId: entityId,
      entityType: entityType,
    };
    //deleteReactionMutation.mutate(data);
  };

  return (
    <>
      <button className="flex items-center [&_div]:hover:visible">
        <div className="flex flex-row" onClick={IdeleteReaction}>
          <img src={nameIcon} height={13.33} width={13.33} />
          <div className={`text-xs font-normal ml-1.5 ${nameStyle}`}>
            {name}
          </div>
        </div>
        <div className=" bg-white h-7 rounded-lg invisible absolute z-1 mb-[50px] shadow-md ">
          <div className="mx-2 py-2 flex flex-row">
            <button
              className="mx-1.5 hover:scale-150"
              onClick={() => {
                setReaction({
                  name: 'like',
                });
                submitReaction('like');
              }}
            >
              <img src={BlueLike} height={16} width={16} />
            </button>
            <button
              className="mx-1.5  hover:scale-150"
              onClick={() => {
                setReaction({
                  name: 'love',
                });
                submitReaction('love');
              }}
            >
              <img src={Love} height={16} width={16} />
            </button>
            <button
              className="mx-1.5 hover:scale-150"
              onClick={() => {
                setReaction({
                  name: 'celebrate',
                });
                submitReaction('celebrate');
              }}
            >
              <img src={Celebrate} height={16} width={16} />
            </button>
            <button
              className="mx-1.5 hover:scale-150"
              onClick={() => {
                setReaction({
                  name: 'support',
                });
                submitReaction('support');
              }}
            >
              <img src={Support} height={16} width={16} />
            </button>
            <button
              className="mx-1.5 hover:scale-150"
              onClick={() => {
                setReaction({
                  name: 'funny',
                });
                submitReaction('funny');
              }}
            >
              <img src={Laugh} height={16} width={16} />
            </button>
            <button
              className="mx-1.5 hover:scale-150"
              onClick={() => {
                setReaction({
                  name: 'insightful',
                });
                submitReaction('insightful');
              }}
            >
              <img src={Insightful} height={16} width={16} />
            </button>
          </div>
        </div>
      </button>
    </>
  );
};
