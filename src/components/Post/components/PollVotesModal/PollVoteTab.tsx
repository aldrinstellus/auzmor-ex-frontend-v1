import { IGetPollVote, useInfinitePollVotes } from 'queries/pollVotes';
import { FC, memo, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import PollVoteRow from './PollVoteRow';
import PollVoteSkeleton from './PollVoteSkeleton';
interface IPollVoteTabProps {
  postId: string;
  optionId?: string;
  limit: number;
}

const PollVoteTab: FC<IPollVoteTabProps> = ({ postId, optionId, limit }) => {
  const rootId = `pollvote-${postId}-${optionId}`;
  const { ref, inView } = useInView({
    root: document.getElementById(rootId),
    rootMargin: '20%',
  });

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfinitePollVotes({ postId, optionId, limit });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const pollVotes = data?.pages.flatMap((page: any) => {
    try {
      return page?.data?.result?.data?.map((vote: IGetPollVote) => {
        try {
          return vote;
        } catch (e) {
          console.log('Error', { vote });
        }
      });
    } catch (error) {
      return [];
    }
  }) as IGetPollVote[];

  return (
    <div id={rootId} className="px-6 h-[390px] overflow-y-auto">
      {isLoading ? (
        <PollVoteSkeleton />
      ) : (
        pollVotes &&
        pollVotes?.map((vote: IGetPollVote) => (
          <div key={vote?.id} className="">
            <PollVoteRow vote={vote} />
          </div>
        ))
      )}
      <div>
        {hasNextPage && isFetchingNextPage && <PollVoteRow isLoading={true} />}
        {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
      </div>
    </div>
  );
};

export default memo(PollVoteTab);
