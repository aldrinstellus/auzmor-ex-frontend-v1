import React, { useRef, useState } from 'react';
import IconButton, {
  Variant as IconVariant,
  Size as SizeVariant,
} from 'components/IconButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReaction, deleteReaction } from 'queries/reaction';
import clsx from 'clsx';

interface LikesProps {
  reaction: string;
  entityId: string;
  entityType: string;
  reactionId: string;
  queryKey: string;
}
interface IReaction {
  name: string;
  icon: string;
  type: string;
  setShowTooltip: (show: false) => void;
}

export enum ReactionType {
  Like = 'like',
  Support = 'support',
  Celebrate = 'celebrate',
  Love = 'love',
  Funny = 'funny',
  Insightful = 'insightful',
}

const reactionIconMap: Record<string, string> = {
  [ReactionType.Like]: 'like',
  [ReactionType.Support]: 'support',
  [ReactionType.Celebrate]: 'celebrate',
  [ReactionType.Love]: 'love',
  [ReactionType.Funny]: 'funny',
  [ReactionType.Insightful]: 'insightful',
};

const reactionNameMap: Record<string, string> = {
  [ReactionType.Like]: 'Like',
  [ReactionType.Support]: 'Support',
  [ReactionType.Celebrate]: 'Celebrate',
  [ReactionType.Love]: 'Love',
  [ReactionType.Funny]: 'Laugh',
  [ReactionType.Insightful]: 'Insightful',
};

const Likes: React.FC<LikesProps> = ({
  reaction,
  entityId,
  entityType,
  reactionId,
  queryKey,
}) => {
  const queryClient = useQueryClient();
  const [showTooltip, setShowTooltip] = useState(true);

  const tooltipRef = useRef<HTMLSpanElement>(null);
  const container = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const nameStyle = clsx(
    {
      'text-[#173E90]': reaction === 'like',
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

  const nameIcon = reactionIconMap[reaction];

  const name = reactionNameMap[reaction];
  const createReactionMutation = useMutation({
    mutationKey: ['create-reaction-mutation'],
    mutationFn: createReaction,

    onError: (error: any) => {
      console.log(error);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });

  const deleteReactionMutation = useMutation({
    mutationKey: ['delete-reaction-mutation'],
    mutationFn: deleteReaction,
    onError: (error: any) => {
      console.log(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });

  const handleReaction = (type: string) => {
    const data = {
      entityId: entityId,
      entityType: entityType,
      reaction: type,
    };

    createReactionMutation.mutate(data);
  };

  const handleDeleteReaction = () => {
    const data = {
      id: reactionId,
      entityId: entityId,
      entityType: entityType,
    };
    if (nameIcon) {
      deleteReactionMutation.mutate(data);
    }
  };

  const Reactions = ({ name, icon, type, setShowTooltip }: IReaction) => {
    return (
      <div className=" space-x-4 mt-1 relative [&_span]:hover:visible">
        <span className="invisible absolute rounded-lg bg-black text-white py-1 px-2 -mt-10">
          {name}
        </span>
        <IconButton
          icon={icon}
          className="!mx-1.5 !bg-inherit hover:scale-150 !p-0"
          onClick={() => {
            handleReaction(type);
            setShowTooltip(false);
          }}
          variant={IconVariant.Primary}
          size={SizeVariant.Large}
        />
      </div>
    );
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      ref={container}
      className="group relative inline-block p-0 cursor-pointer"
    >
      {showTooltip ? (
        <span
          ref={tooltipRef}
          className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition text-white p-1 rounded absolute  bottom-full  whitespace-nowrap"
        >
          <div
            className={`h-8 flex flex-row items-center bg-white rounded-lg shadow-md`}
          >
            <Reactions
              name="Like"
              icon="like"
              type={ReactionType.Like}
              setShowTooltip={setShowTooltip}
            />
            <Reactions
              name="Love"
              icon="love"
              type={ReactionType.Love}
              setShowTooltip={setShowTooltip}
            />
            <Reactions
              name="Celebrate"
              icon="celebrate"
              type={ReactionType.Celebrate}
              setShowTooltip={setShowTooltip}
            />
            <Reactions
              name="Support"
              icon="support"
              type={ReactionType.Support}
              setShowTooltip={setShowTooltip}
            />
            <Reactions
              name="Funny"
              icon="funny"
              type={ReactionType.Funny}
              setShowTooltip={setShowTooltip}
            />
            <Reactions
              name="Insightful"
              icon="insightful"
              type={ReactionType.Insightful}
              setShowTooltip={setShowTooltip}
            />
          </div>
        </span>
      ) : null}

      <div className="flex flex-row" onClick={handleDeleteReaction}>
        <IconButton
          icon={nameIcon ? nameIcon : 'likeIcon'}
          className=" !bg-inherit  !p-0"
          variant={IconVariant.Primary}
          size={SizeVariant.Medium}
        />
        <div
          className={`text-xs font-normal ml-1 ${
            name ? nameStyle : 'text-neutral-500 '
          } `}
        >
          {name ? name : 'Like'}
        </div>
      </div>
    </div>
  );
};

export default Likes;
