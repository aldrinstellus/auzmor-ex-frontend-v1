import React from 'react';
import IconButton, {
  Variant as IconVariant,
  Size as SizeVariant,
} from 'components/IconButton';
import { useMutation } from '@tanstack/react-query';
import { createReaction, deleteReaction } from 'queries/reaction';
import clsx from 'clsx';
import queryClient from 'utils/queryClient';

interface LikesProps {
  reaction: string;
  entityId: string;
  entityType: string;
  reactionId: string;
}

export const Likes: React.FC<LikesProps> = ({
  reaction,
  entityId,
  entityType,
  reactionId,
}) => {
  const nameStyle = clsx(
    {
      'text-[#173E90]': reaction === 'like',
    },
    {
      'text-neutral-500': reaction === 'Like',
    },
    {
      'text-[#F96B40]': reaction === 'love',
    },
    {
      'text-yellow-500': reaction === 'celebrate',
    },
    {
      'text-red-500': reaction === 'support',
    },
    {
      'text-yellow-500': reaction === 'funny',
    },
    {
      'text-yellow-500': reaction === 'insightful',
    },
  );

  const reactionIconMap: { [key: string]: any } = {
    like: 'blueLike',
    support: 'support',
    Like: 'like',
    celebrate: 'celebrate',
    love: 'love',
    funny: 'funny',
    insightful: 'insightful',
  };
  const reactionNameMap: { [key: string]: any } = {
    like: 'Like',
    support: 'Support',
    celebrate: 'Celebrate',
    love: 'Love',
    funny: 'Funny',
    insightful: 'Insightful',
  };
  const nameIcon = reactionIconMap[reaction];

  const name = reactionNameMap[reaction];

  const createReactionMutation = useMutation({
    mutationKey: ['create-reaction-mutation'],
    mutationFn: createReaction,
    onError: (error: any) => {
      console.log(error);
    },
    onSuccess: (data: any, variables, context) => {},
  });

  const deleteReactionMutation = useMutation({
    mutationKey: ['delete-reaction-mutation'],
    mutationFn: deleteReaction,
    onError: (error: any) => {
      console.log(error);
    },
    onSuccess: () => {},
  });

  const submitReaction = (type: string) => {
    const data = {
      entityId: entityId,
      entityType: entityType,
      type: type,
    };

    createReactionMutation.mutate(data);
  };

  const handleDeleteReaction = () => {
    const data = {
      id: reactionId,
      entityId: entityId,
      entityType: entityType,
    };
    deleteReactionMutation.mutate(data);
  };

  return (
    <>
      <button className="flex items-center [&_div]:hover:visible">
        <div className="flex flex-row" onClick={handleDeleteReaction}>
          <IconButton
            icon={nameIcon}
            className=" !bg-inherit  !p-0"
            onClick={() => {}}
            variant={IconVariant.Primary}
            size={SizeVariant.Small}
          />
          <div className={`text-xs font-normal ml-1.5 ${nameStyle}`}>
            {name}
          </div>
        </div>
        <div className=" bg-white h-8 rounded-[8px] invisible absolute z-1 mb-[50px] shadow-md ">
          <div className="flex flex-row items-center ">
            <div className="mb-2 mt-1 space-x-4 [&_span]:hover:visible">
              <span className="invisible rounded-[8px] bg-black text-white py-1 px-2 absolute z-1 mt-[-40px]">
                Like
              </span>
              <IconButton
                icon={'blueLike'}
                className="!mx-1.5 !bg-inherit hover:scale-150 !p-0"
                onClick={() => {
                  submitReaction('like');
                }}
                variant={IconVariant.Primary}
                size={SizeVariant.Large}
              />
            </div>
            <div className="mb-2 mt-1 space-x-4 [&_span]:hover:visible">
              <span className="invisible rounded-[8px] bg-black text-white py-1 px-2 absolute z-1 mt-[-40px]">
                Love
              </span>
              <IconButton
                icon={'love'}
                className="!mx-1.5 !bg-inherit hover:scale-150 !p-0"
                onClick={() => {
                  submitReaction('love');
                }}
                variant={IconVariant.Primary}
                size={SizeVariant.Large}
              />
            </div>
            <div className="mb-2 mt-1 space-x-4 [&_span]:hover:visible">
              <span className="invisible rounded-[8px] bg-black text-white py-1 px-2 absolute z-1 mt-[-40px]">
                Celebrate
              </span>
              <IconButton
                icon={'celebrate'}
                className="!mx-1.5 !bg-inherit hover:scale-150 !p-0"
                onClick={() => {
                  submitReaction('celebrate');
                }}
                variant={IconVariant.Primary}
                size={SizeVariant.Large}
              />
            </div>
            <div className="mb-2 mt-1 space-x-4 [&_span]:hover:visible">
              <span className="invisible rounded-[8px] bg-black text-white py-1 px-2 absolute z-1 mt-[-40px]">
                Support
              </span>
              <IconButton
                icon={'support'}
                className="!mx-1.5 !bg-inherit hover:scale-150 !p-0"
                onClick={() => {
                  submitReaction('support');
                }}
                variant={IconVariant.Primary}
                size={SizeVariant.Large}
              />
            </div>
            <div className="mb-2 mt-1 space-x-4 [&_span]:hover:visible">
              <span className="invisible rounded-[8px] bg-black text-white py-1 px-2 absolute z-1 mt-[-40px]">
                Funny
              </span>
              <IconButton
                icon={'laugh'}
                className="!mx-1.5 !bg-inherit hover:scale-150 !p-0"
                onClick={() => {
                  submitReaction('funny');
                }}
                variant={IconVariant.Primary}
                size={SizeVariant.Large}
              />
            </div>
            <div className="mb-2 mt-1 space-x-4 [&_span]:hover:visible">
              <span className="invisible rounded-[8px] bg-black text-white py-1 px-2 absolute z-1 mt-[-40px]">
                Insightful
              </span>
              <IconButton
                icon={'insightful'}
                className="!mx-1.5 !bg-inherit hover:scale-150 !p-0"
                onClick={() => {
                  submitReaction('insightful');
                }}
                variant={IconVariant.Primary}
                size={SizeVariant.Large}
              />
            </div>
          </div>
        </div>
      </button>
    </>
  );
};
