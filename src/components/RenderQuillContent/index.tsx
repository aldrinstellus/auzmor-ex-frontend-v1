import React, { ReactElement, useEffect, useState } from 'react';
import { DeltaOperation } from 'quill';
import Mention from './components/Mention';
import Hashtag from './components/Hashtag';
import Emoji from './components/Emoji';
import { Text } from './components/Text';
import MediaPreview, { Mode } from 'components/MediaPreview';
import { IGetPost } from 'queries/post';
import { getMentionProps } from './utils';
import PreviewCard from 'components/PreviewCard';
import { removeElementsByClass } from 'utils/misc';
import { IComment } from 'components/Comments';

type RenderQuillContent = {
  data: IGetPost | IComment;
};

const RenderQuillContent: React.FC<RenderQuillContent> = ({
  data,
}): ReactElement => {
  const content = data?.content?.editor;
  const mentions = data?.mentions ? data.mentions : [];
  const link = (data as IGetPost)?.link;
  const media = (data as IGetPost)?.files;

  useEffect(() => {
    const element = document.getElementById(`${data?.id}-content`);
    if (
      element &&
      element.parentNode &&
      element.scrollHeight > element.clientHeight
    ) {
      removeElementsByClass('read-more-button');
      const button = document.createElement('button');
      button.setAttribute('data-testid', 'feed-post-seemore');
      button.type = 'button';
      button.classList.add(
        'showMoreLess',
        'read-more-button',
        'text-neutral-500',
        'font-bold',
      );
      button.textContent = 'See more';
      element.parentNode.insertBefore(button, element.nextSibling);
    }
    const showMoreLessButtons = document.querySelectorAll('.showMoreLess');
    showMoreLessButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const paragraph = button.previousElementSibling;
        if (paragraph && paragraph.classList.contains('line-clamp-none')) {
          button.textContent = 'See more';
          paragraph.classList.remove('line-clamp-none');
        } else {
          if (paragraph) {
            button.textContent = 'See less';
            paragraph.classList.add('line-clamp-none');
          }
        }
      });
    });
  }, []);

  const postContent = content?.ops?.map((op: DeltaOperation) => {
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

  return (
    <div>
      <span
        className="line-clamp-3 paragraph"
        id={`${data?.id}-content`}
        data-testid="feed-post-content"
      >
        <span>{postContent}</span>
      </span>
      {link && (
        <div className="mt-4">
          <PreviewCard metaData={link} className="my-2" />
        </div>
      )}
      {media && (
        <div className="mt-4">
          <MediaPreview media={media} mode={Mode.View} />
        </div>
      )}
    </div>
  );
};

export default RenderQuillContent;
