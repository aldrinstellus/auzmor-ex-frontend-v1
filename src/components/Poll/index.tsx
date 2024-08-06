import IconButton, {
  Size as IconButtonSize,
  Variant as IconButtonVariant,
} from 'components/IconButton';
import { FC, Fragment, useContext, useEffect, useState } from 'react';
import './styles.css';
import {
  CreatePostContext,
  CreatePostFlow,
  IPoll,
} from 'contexts/CreatePostContext';
import { getTimeFromNow } from 'utils/time';
import { useMutation } from '@tanstack/react-query';
import { IPost, PostType, deletePollVote, pollVote } from 'queries/post';
import { useFeedStore } from 'stores/feedStore';
import { produce } from 'immer';
import Button, {
  Variant as ButtonVariant,
  Size as ButtonSize,
} from 'components/Button';
import clsx from 'clsx';
import useRole from 'hooks/useRole';
import { useCurrentTimezone } from 'hooks/useCurrentTimezone';
import { getLearnUrl } from 'utils/misc';

export enum PollMode {
  VIEW = 'VIEW',
  EDIT = 'EDIT',
  LEARN = 'LEARN',
}

type PollProps = {
  mode: PollMode;
  postId?: string;
  isDeletable?: boolean;
  myVote?: { optionId: string }[];
  isAnnouncementWidgetPreview?: boolean;
  ctaButton?: { text: string; url: string };
  readOnly?: boolean;
};

function animateOption(
  postId: string,
  index: number,
  width: string,
  flexGrow: string,
): void {
  const optionProgress = document.getElementById(
    `option-progress-${postId}-${index}`,
  );
  optionProgress?.animate(
    {
      width: ['0%', width],
      easing: ['ease-out', 'ease-out'],
    },
    400,
  );
  optionProgress?.setAttribute('style', `width: ${width}`);

  const optionText = document.getElementById(`option-text-${postId}-${index}`);
  optionText?.animate(
    {
      flexGrow: ['1', flexGrow],
      easing: ['ease-out', 'ease-out'],
    },
    400,
  );
  optionText?.setAttribute('style', `flex-grow: ${flexGrow}`);
}

function getVotePercent(total: number, votes?: number) {
  return total ? `${Math.round(((votes || 0) / total) * 100)}%` : '0%';
}

const Poll: FC<IPoll & PollProps> = ({
  question,
  options,
  closedAt,
  myVote,
  postId = '',
  mode = PollMode.VIEW,
  isDeletable = false,
  isAnnouncementWidgetPreview,
  ctaButton,
  readOnly = false,
}) => {
  const { currentTimezone } = useCurrentTimezone();
  const userTimezone = currentTimezone || 'Asia/Kolkata';

  const [showResults, setShowResults] = useState(false);
  const { isAdmin } = useRole();
  const getPost = useFeedStore((state) => state.getPost);
  const updateFeed = useFeedStore((state) => state.updateFeed);
  const { setPoll, setActiveFlow, setPostType } = useContext(CreatePostContext);

  const voteMutation = useMutation({
    mutationKey: ['poll-vote'],
    mutationFn: pollVote,
    onMutate: ({ postId, optionId }) => {
      const previousPost = getPost(postId);
      updateFeed(
        postId,
        produce(getPost(postId), (draft: IPost) => {
          draft.pollContext?.options.forEach((option) => {
            if (option._id === optionId) option.votes = (option.votes || 0) + 1;
            if (
              previousPost.myVote?.some(
                (vote) => option._id === vote.optionId,
              ) &&
              option.votes
            )
              option.votes -= 1;
          });
          draft.myVote = [{ optionId }];
        }),
      );
      return { previousPost };
    },
    onError: (error, variables, context) => {
      updateFeed(context!.previousPost.id!, context!.previousPost!);
    },
  });

  const deleteVoteMutation = useMutation({
    mutationKey: ['delete-poll-vote'],
    mutationFn: deletePollVote,
    onMutate: ({ postId, optionId }) => {
      const previousPost = getPost(postId);
      updateFeed(
        postId,
        produce(getPost(postId), (draft: IPost) => {
          draft.pollContext?.options.forEach((option) => {
            if (option._id === optionId && option.votes) option.votes -= 1;
          });
          draft.myVote = undefined;
        }),
      );
      return { previousPost };
    },
    onError: (error, variables, context) => {
      updateFeed(context!.previousPost.id!, context!.previousPost!);
    },
  });

  const total = options
    .map((option) => option.votes)
    .reduce((s: number, a) => s + (a || 0), 0);

  const timeLeft = getTimeFromNow(closedAt, userTimezone);
  const showTotal = mode === PollMode.VIEW;
  const voted = !!myVote?.length;
  const isLoading = voteMutation.isLoading || deleteVoteMutation.isLoading;
  const showViewResults =
    mode === PollMode.VIEW && isAdmin && !voted && !readOnly;

  useEffect(() => {
    if (mode === PollMode.EDIT) return;
    options.forEach((option, index) => {
      if (showResults || voted || !timeLeft) {
        animateOption(postId, index, getVotePercent(total, option.votes), '0');
      } else {
        animateOption(postId, index, '0%', '1');
      }
    });
  }, [mode, options, voted, showResults, timeLeft]);

  if (isAnnouncementWidgetPreview) {
    return (
      <div className="bg-neutral-100 py-3 px-2 rounded-9xl w-full flex flex-col gap-3">
        <p className="text-neutral-900 font-bold break-normal [overflow-wrap:anywhere] line-clamp-2">
          {question}
        </p>
        <div className="flex flex-row gap-3 items-center text-xs leading-normal">
          <p
            className="text-orange-500  font-bold"
            data-testid="createpost-poll-expiry"
          >
            {timeLeft ? `${timeLeft} left` : 'Poll closed'}
          </p>
          {showTotal && (
            <Fragment>
              <div className="bg-neutral-500 rounded-full w-1 h-1" />
              <p
                className="text-neutral-500 font-normal"
                data-testid="feed-post-poll-votes"
              >{`${total} votes`}</p>
            </Fragment>
          )}
        </div>
        <Button
          label={voted || !timeLeft ? 'View Results' : 'Vote Now'}
          size={ButtonSize.Small}
          className="py-[6px]"
        />
      </div>
    );
  }

  return (
    <div className="bg-neutral-100 py-4 px-8 rounded-9xl w-full border border-neutral-200">
      {/* Header */}
      <div className="flex items-start gap-4">
        <p className="text-neutral-900 font-bold flex-auto pb-4 break-normal [overflow-wrap:anywhere]">
          {question}
        </p>
        {mode === PollMode.EDIT && (
          <div className="flex gap-x-2 -mr-4">
            {timeLeft && (
              <IconButton
                icon="edit"
                onClick={() => setActiveFlow(CreatePostFlow.CreatePoll)}
                variant={IconButtonVariant.Secondary}
                size={IconButtonSize.Medium}
                borderAround
                color="text-black"
                className="bg-white !rounded-7xl"
                borderAroundClassName="!rounded-7xl"
                dataTestId="createpost-edit-poll"
              />
            )}
            {isDeletable && (
              <IconButton
                icon="close"
                onClick={() => {
                  setPoll(null);
                  setPostType(PostType.Update);
                }}
                variant={IconButtonVariant.Secondary}
                size={IconButtonSize.Medium}
                borderAround
                color="text-black"
                className="bg-white !rounded-7xl"
                borderAroundClassName="!rounded-7xl"
                dataTestId="createpost-remove-poll"
              />
            )}
          </div>
        )}
      </div>

      {/* Options */}
      {mode === PollMode.LEARN ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-neutral-900">
            Choose one option
          </p>
          <ul className="list-disc flex flex-col gap-4">
            {options.map((option) => (
              <li
                key={option._id}
                className="ml-6 text-sm font-medium text-neutral-900"
              >
                {option.text}
              </li>
            ))}
          </ul>
          <div className="flex mb-4">
            <Button
              label={ctaButton?.text || ''}
              onClick={() =>
                window.location.assign(ctaButton?.url || getLearnUrl())
              }
              labelClassName="px-4 font-normal"
              size={ButtonSize.Small}
            />
          </div>
        </div>
      ) : (
        <div className="pb-6 flex flex-col gap-2">
          {options.map((option, index) => {
            const votedThisOption =
              voted && myVote?.some((vote) => vote.optionId === option._id);
            const cursorDefault =
              mode === PollMode.EDIT ||
              showResults ||
              isLoading ||
              !timeLeft ||
              !postId ||
              !option._id;
            const cursorPointer = !cursorDefault && !readOnly;
            const cursorClass = clsx({
              'cursor-default': cursorDefault,
              'cursor-pointer': cursorPointer,
            });
            return (
              <div
                className={`grid ${cursorClass}`}
                key={option._id}
                data-testid={`feed-post-poll-ans${index + 1}`}
                onClick={() => {
                  if (readOnly) {
                    return;
                  }
                  if (cursorPointer && !isLoading && postId && option._id) {
                    if (votedThisOption) {
                      deleteVoteMutation.mutate({
                        postId,
                        optionId: option._id,
                      });
                    } else {
                      voteMutation.mutate({ postId, optionId: option._id });
                    }
                  }
                }}
              >
                {/* The white background that contains the option */}
                <div className="grid-area w-full bg-white rounded-19xl" />
                {/* The progress bar that fills up the background */}
                <div
                  className={`grid-area w-0 ${
                    votedThisOption ? 'bg-primary-600' : 'bg-primary-100'
                  } rounded-19xl`}
                  id={`option-progress-${postId}-${index}`}
                />
                {/* The option itself */}
                <div className="grid-area flex items-center justify-between w-full px-5 py-3 text-neutral-900 font-medium">
                  <span
                    className={`text-center grow ${
                      votedThisOption ? 'text-white' : 'text-inherit'
                    }`}
                    id={`option-text-${postId}-${index}`}
                  >
                    {option.text}
                  </span>

                  <span>
                    {showResults || voted || !timeLeft
                      ? getVotePercent(total, option.votes)
                      : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-row gap-3 items-center text-xs leading-normal">
        <p
          className="text-orange-500  font-bold"
          data-testid="createpost-poll-expiry"
        >
          {timeLeft ? `${timeLeft} left` : 'Poll closed'}
        </p>
        {showTotal && (
          <Fragment>
            <div className="bg-neutral-500 rounded-full w-1 h-1" />
            <p
              className="text-neutral-500 font-normal"
              data-testid="feed-post-poll-votes"
            >{`${total} votes`}</p>
          </Fragment>
        )}
        {showViewResults && (
          <Fragment>
            <div className="bg-neutral-500 rounded-full w-1 h-1" />
            <Button
              size={ButtonSize.ExtraSmall}
              variant={ButtonVariant.Tertiary}
              className="!p-0 !bg-transparent"
              label={showResults ? 'Undo' : 'View results'}
              labelClassName="text-primary-500 font-bold leading-normal"
              onClick={() => setShowResults(!showResults)}
              dataTestId={`feed-post-poll-${
                showResults ? 'undo' : 'viewresult'
              }`}
            />
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default Poll;
