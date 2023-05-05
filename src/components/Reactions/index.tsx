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
  queryKey: string;
}
interface IReaction {
  name: string;
  icon: string;
  type: string;
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
    onSuccess: (data: any, variables, context) => {
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
    deleteReactionMutation.mutate(data);
  };

  const Reactions = ({ name, icon, type }: IReaction) => {
    return (
      <div className="mb-2 mt-1 space-x-4 [&_span]:hover:visible">
        <span className="invisible rounded-lg bg-black text-white py-1 px-2 absolute z-1 -mt-10">
          {name}
        </span>
        <IconButton
          icon={icon}
          className="!mx-1.5 !bg-inherit hover:scale-150 !p-0"
          onClick={() => {
            handleReaction(type);
          }}
          variant={IconVariant.Primary}
          size={SizeVariant.Large}
        />
      </div>
    );
  };

  return (
    <div className="flex items-center [&_div]:hover:visible">
      <div className="flex flex-row" onClick={handleDeleteReaction}>
        <IconButton
          icon={nameIcon ? nameIcon : 'likeIcon'}
          className=" !bg-inherit  !p-0"
          variant={IconVariant.Primary}
          size={SizeVariant.Small}
        />
        <div
          className={`text-xs font-normal ml-1.5 ${
            name ? nameStyle : 'text-neutral-500 '
          } `}
        >
          {name ? name : 'Like'}
        </div>
      </div>
      <div className=" bg-white h-8 rounded-lg invisible absolute z-1 mb-12 shadow-md">
        <div className="flex flex-row items-center  ">
          <Reactions name="Like" icon="like" type={ReactionType.Like} />
          <Reactions name="Love" icon="love" type={ReactionType.Love} />
          <Reactions
            name="Celebrate"
            icon="celebrate"
            type={ReactionType.Celebrate}
          />
          <Reactions
            name="Support"
            icon="support"
            type={ReactionType.Support}
          />
          <Reactions name="Funny" icon="laugh" type={ReactionType.Funny} />
          <Reactions
            name="Insightful"
            icon="insightful"
            type={ReactionType.Insightful}
          />
        </div>
      </div>
    </div>
  );
};

export default Likes;
