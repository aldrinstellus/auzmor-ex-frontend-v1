import React, { useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReaction, deleteReaction } from 'queries/reaction';
import clsx from 'clsx';
import { useFeedStore } from 'stores/feedStore';
import { produce } from 'immer';
import { useCommentStore } from 'stores/commentStore';
import Icon from 'components/Icon';

interface LikesProps {
  reaction: string;
  entityId: string;
  entityType: string;
  reactionId: string;
  queryKey: string;
  dataTestIdPrefix?: string;
}
interface IReaction {
  name: string;
  icon: string;
  type: string;
  dataTestId: string;
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
  dataTestIdPrefix,
}) => {
  const { feed, updateFeed } = useFeedStore();
  const { comment, updateComment } = useCommentStore();
  const [showTooltip, setShowTooltip] = useState(true);

  const tooltipRef = useRef<HTMLSpanElement>(null);
  const container = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const nameStyle = clsx(
    {
      'text-blue-900': reaction === 'like',
    },

    {
      'text-orange-500': reaction === 'love',
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
  const queryClient = useQueryClient();

  const name = reactionNameMap[reaction];
  const createReactionMutation = useMutation({
    mutationKey: ['create-reaction-mutation'],
    mutationFn: createReaction,
    onMutate: (variables) => {
      if (variables.entityType === 'post') {
        const previousPost = feed[variables.entityId];
        updateFeed(
          variables.entityId,
          produce(feed[variables.entityId], (draft) => {
            (draft.reactionsCount =
              draft.reactionsCount &&
              Object.keys(draft.reactionsCount).length > 0
                ? Object.keys(draft.myReaction || {}).length > 0 // if reactions count exist
                  ? {
                      ...draft.reactionsCount,
                      // if reactions count and my reaction exist
                      [draft.myReaction!.reaction as string]:
                        draft.reactionsCount[
                          draft.myReaction!.reaction as string
                        ] - 1,
                      [variables.reaction as string]: draft.reactionsCount[
                        variables.reaction as string
                      ]
                        ? variables.reaction === draft.myReaction!.reaction
                          ? draft.reactionsCount[variables.reaction as string]
                          : draft.reactionsCount[variables.reaction as string] +
                            1
                        : 1,
                    }
                  : {
                      ...draft.reactionsCount,
                      // if reactions count exist but my reaction does not exist
                      [variables.reaction as string]: draft.reactionsCount[
                        variables.reaction as string
                      ]
                        ? draft.reactionsCount[variables.reaction as string] + 1
                        : 1,
                    }
                : { [variables.reaction as string]: 1 }),
              (draft.myReaction = {
                reaction: variables.reaction,
                type: variables.entityType,
              }); // if reactions count does not exist at all
          }),
        );
        return { previousPost };
      } else if (variables.entityType === 'comment') {
        const previousComment = comment[variables.entityId];
        updateComment(
          variables.entityId,
          produce(comment[variables.entityId], (draft) => {
            (draft.reactionsCount =
              draft.reactionsCount &&
              Object.keys(draft.reactionsCount).length > 0
                ? Object.keys(draft.myReaction || {}).length > 0
                  ? {
                      ...draft.reactionsCount,
                      [draft.myReaction!.reaction as string]:
                        draft.reactionsCount[
                          draft.myReaction!.reaction as string
                        ] - 1,
                      [variables.reaction as string]: draft.reactionsCount[
                        variables.reaction as string
                      ]
                        ? variables.reaction === draft.myReaction!.reaction
                          ? draft.reactionsCount[variables.reaction as string]
                          : draft.reactionsCount[variables.reaction as string] +
                            1
                        : 1,
                    }
                  : {
                      ...draft.reactionsCount,
                      [variables.reaction as string]: draft.reactionsCount[
                        variables.reaction as string
                      ]
                        ? draft.reactionsCount[variables.reaction as string] + 1
                        : 1,
                    }
                : { [variables.reaction as string]: 1 }),
              (draft.myReaction = {
                reaction: variables.reaction,
                type: variables.entityType,
              });
          }),
        );
        return { previousComment };
      }
    },
    onSuccess: (data, variables) => {
      if (variables.entityType === 'post') {
        updateFeed(
          variables.entityId,
          produce(feed[variables.entityId], (draft) => {
            draft.myReaction = {
              ...draft.myReaction,
              createdBy: data.createdBy,
              id: data.id,
            }; // if reactions count does not exist at all
          }),
        );
      } else if (variables.entityType === 'comment') {
        updateComment(
          variables.entityId,
          produce(comment[variables.entityId], (draft) => {
            draft.myReaction = {
              ...draft.myReaction,
              createdBy: data.createdBy,
              id: data.id,
            };
          }),
        );
      }
    },
    onError: (error, variables, context) => {
      if (variables.entityType === 'post') {
        updateFeed(context!.previousPost!.id!, context!.previousPost!);
      } else if (variables.entityType === 'comment') {
        updateComment(context!.previousComment!.id!, context!.previousComment!);
      }
    },
  });

  const deleteReactionMutation = useMutation({
    mutationKey: ['delete-reaction-mutation'],
    mutationFn: deleteReaction,
    onMutate: (variables) => {
      if (variables.id === '') {
        queryClient.cancelQueries({
          queryKey: ['create-reaction-mutation', 'delete-reaction-mutation'],
        });
        return;
      }
      if (variables.entityType === 'post') {
        const previousPost = feed[variables.entityId];
        updateFeed(
          variables.entityId,
          produce(feed[variables.entityId], (draft) => {
            (draft.myReaction = undefined),
              (draft.reactionsCount = {
                ...feed[variables.entityId].reactionsCount,
                [feed[variables.entityId]!.myReaction!.reaction!]:
                  feed[variables.entityId].reactionsCount[
                    feed[variables.entityId]!.myReaction!.reaction!
                  ] - 1,
              });
          }),
        );
        return { previousPost };
      } else if (variables.entityType === 'comment') {
        const previousComment = comment[variables.entityId];
        updateComment(
          variables.entityId,
          produce(comment[variables.entityId], (draft) => {
            (draft.myReaction = undefined),
              (draft.reactionsCount = {
                ...comment[variables.entityId].reactionsCount,
                [comment[variables.entityId]!.myReaction!.reaction!]:
                  comment[variables.entityId].reactionsCount[
                    comment[variables.entityId]!.myReaction!.reaction!
                  ] - 1,
              });
          }),
        );
        return { previousComment };
      }
    },
    onError: (error, variables, context) => {
      if (variables.entityType === 'post') {
        updateFeed(context!.previousPost!.id!, context!.previousPost!);
      } else if (variables.entityType === 'comment') {
        updateComment(context!.previousComment!.id!, context!.previousComment!);
      }
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

  const Reactions = ({
    name,
    icon,
    type,
    setShowTooltip,
    dataTestId,
  }: IReaction) => {
    return (
      <div className="space-x-0 relative [&_span]:hover:visible">
        <span className="invisible absolute rounded-7xl bg-black opacity-70 text-white text-xs p-2 -mt-10">
          {name}
        </span>
        <Icon
          name={icon}
          className="hover:scale-150"
          onClick={() => {
            handleReaction(type);
            setShowTooltip(false);
          }}
          size={24}
          dataTestId={dataTestId}
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
            className={`h-[42px] flex flex-row items-center bg-white rounded-7xl shadow-lg py-2 px-3 space-x-4 mb-3.5 -ml-1`}
            data-testid={dataTestIdPrefix}
          >
            <Reactions
              name="Like"
              icon="likeFilled"
              type={ReactionType.Like}
              setShowTooltip={setShowTooltip}
              dataTestId={`${dataTestIdPrefix}-like`}
            />
            <Reactions
              name="Love"
              icon="love"
              type={ReactionType.Love}
              setShowTooltip={setShowTooltip}
              dataTestId={`${dataTestIdPrefix}-love`}
            />
            <Reactions
              name="Celebrate"
              icon="celebrate"
              type={ReactionType.Celebrate}
              setShowTooltip={setShowTooltip}
              dataTestId={`${dataTestIdPrefix}-celebrate`}
            />
            <Reactions
              name="Support"
              icon="support"
              type={ReactionType.Support}
              setShowTooltip={setShowTooltip}
              dataTestId={`${dataTestIdPrefix}-support`}
            />
            <Reactions
              name="Laugh"
              icon="funny"
              type={ReactionType.Funny}
              setShowTooltip={setShowTooltip}
              dataTestId={`${dataTestIdPrefix}-funny`}
            />
            <Reactions
              name="Insightful"
              icon="insightful"
              type={ReactionType.Insightful}
              setShowTooltip={setShowTooltip}
              dataTestId={`${dataTestIdPrefix}-insightful`}
            />
          </div>
        </span>
      ) : null}

      <div
        className="flex items-center space-x-1"
        onClick={() => {
          switch (true) {
            case !feed[entityId]?.myReaction && queryKey === 'feed':
              handleReaction('like');
              break;
            case !comment[entityId]?.myReaction && queryKey === 'comments':
              handleReaction('like');
              break;
            default:
              handleDeleteReaction();
              break;
          }
        }}
        data-testid={'liketo-commentcta'}
      >
        <Icon name={nameIcon ? nameIcon : 'likeIcon'} size={16} />
        <div
          className={`text-xs font-normal ${
            name ? nameStyle : 'text-neutral-500 group-hover:text-primary-500'
          } `}
        >
          {name ? name : 'Like'}
        </div>
      </div>
    </div>
  );
};

export default Likes;
