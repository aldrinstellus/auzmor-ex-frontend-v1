import { FC, ReactElement, useEffect, useMemo } from 'react';
import { DeltaOperation } from 'quill';
import clsx from 'clsx';

// components
import Mention from './components/Mentions';
import Hashtag from './components/Hashtag';
import Emoji from './components/Emoji';
import { Text } from './components/Text';
import MediaPreview from 'components/MediaPreview';
import PreviewCard from 'components/PreviewCard';
import { IComment } from 'components/Comments';
import { IMedia } from 'contexts/CreatePostContext';
import { Metadata } from 'components/PreviewLink/types';
import AvatarChips from 'components/AvatarChips';

// queries
import { IPost } from 'queries/post';

// utils
import { getMentionProps } from './utils';
import { quillHashtagConversion, removeElementsByClass } from 'utils/misc';
import Poll, { PollMode } from 'components/Poll';

type RenderQuillContent = {
  data: IPost | IComment;
  isComment?: boolean;
  isAnnouncementWidgetPreview?: boolean;
};

const RenderQuillContent: FC<RenderQuillContent> = ({
  data,
  isComment = false,
  isAnnouncementWidgetPreview = false,
}): ReactElement => {
  const content = data?.content?.editor;
  const mentions = data?.mentions ? data.mentions : [];
  const link = (data as IPost)?.link;
  const media = (data as IPost)?.files;
  const poll = (data as IPost)?.pollContext;
  const myVote = (data as IPost)?.myVote;
  const postType = (data as IPost)?.type;

  const isEmpty = useMemo(() => {
    const ops = data?.content.editor.ops || [];

    for (const op of ops) {
      if (op.insert && op.insert.emoji) {
        return false; // If an emoji is found, return false
      }
    }
    return data?.content.text === '\n' || data?.content.text === '';
  }, [data]);

  useEffect(() => {
    const element = document.getElementById(`${data?.id}-content`);
    if (
      element &&
      element.parentNode &&
      element.scrollHeight > element.clientHeight
    ) {
      removeElementsByClass(`${data?.id}-expand-collapse-button`);
      const button = document.createElement('button');
      button.setAttribute('id', `${data?.id}-expand-collapse-button`);
      button.setAttribute('data-testid', 'feed-post-seemore');
      button.type = 'button';
      button.classList.add(
        'showMoreLess',
        'read-more-button',
        'text-neutral-500',
        'font-bold',
        'text-sm',
        `${data?.id}-expand-collapse-button`,
      );
      button.textContent = 'See more';
      element.parentNode.insertBefore(button, element.nextSibling);
    }
    const button = document.getElementById(
      `${data?.id}-expand-collapse-button`,
    );
    if (button) {
      button.addEventListener('click', () => {
        const paragraph = button.previousElementSibling;
        paragraph?.classList.add('line-clamp-none');
        button.remove();
      });
    }
  }, []);

  const updatedContent = quillHashtagConversion(content);

  const postContent = updatedContent?.ops?.map((op: DeltaOperation) => {
    switch (true) {
      case op.insert.hasOwnProperty('mention'):
        return (
          <Mention
            value={op.insert.mention?.value}
            {...getMentionProps(mentions, op.insert.mention)}
            userId={op.insert.mention.id}
          />
        );
      case op.insert.hasOwnProperty('hashtag'):
        return <Hashtag value={op.insert.hashtag?.value} />;
      case op.insert.hasOwnProperty('emoji'):
        return <Emoji value={op.insert.emoji} />;
      default:
        return (
          <Text
            value={op.insert}
            attributes={op?.attributes}
            isLink={op?.attributes?.link ? true : false}
          />
        );
    }
  });

  const containerStyle = useMemo(
    () =>
      clsx({
        'w-full flex justify-start': isComment,
      }),
    [],
  );

  const mediaPreviewStyle = useMemo(
    () =>
      clsx({
        'w-64 h-32 overflow-hidden rounded-9xl': isComment,
      }),
    [],
  );

  return (
    <div className="w-full text-sm flex flex-col gap-4">
      {!isEmpty && (
        <span
          className="line-clamp-3 paragraph pt-px"
          id={`${data?.id}-content`}
          data-testid={isComment ? 'comment-content' : 'feed-post-content'}
        >
          <span>{postContent}</span>
        </span>
      )}

      {link && <PreviewCard metaData={link as Metadata} className="" />}
      {media && media.length > 0 && (
        <div
          className={containerStyle}
          data-testid={
            data?.shoutoutRecipients && data?.shoutoutRecipients.length > 0
              ? 'feed-post-shoutout'
              : ''
          }
        >
          <MediaPreview
            className={mediaPreviewStyle}
            media={media as IMedia[]}
            showAddMediaButton={false}
            showEditButton={false}
            isAnnouncementWidgetPreview={isAnnouncementWidgetPreview}
          />
        </div>
      )}
      {poll && postType === 'POLL' && (
        <div className="mt-4">
          <Poll
            question={poll.question}
            closedAt={poll.closedAt}
            options={poll.options}
            myVote={myVote}
            postId={data.id}
            mode={PollMode.VIEW}
          />
        </div>
      )}
      {data?.shoutoutRecipients &&
        data?.shoutoutRecipients.length > 0 &&
        !isAnnouncementWidgetPreview && (
          <div className="flex flex-col gap-2">
            <p
              className="text-xs text-neutral-500"
              data-testid="feed-post-shoutoutto-list"
            >
              Shoutout to:
            </p>
            <AvatarChips
              users={data.shoutoutRecipients}
              showCount={3}
              dataTestId="feed-post-shoutoutto-"
            />
          </div>
        )}
    </div>
  );
};

export default RenderQuillContent;
