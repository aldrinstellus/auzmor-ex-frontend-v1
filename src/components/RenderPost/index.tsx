import React, { ReactElement } from 'react';
import { DeltaOperation } from 'quill';
import Mention from './components/Mention';
import Hashtag from './components/Hashtag';
import Emoji from './components/Emoji';
import { Text } from './components/Text';
import PreviewLink from 'components/PreviewLink';
import MediaPreview, { Mode } from 'components/MediaPreview';
import { IGetPost } from 'queries/post';
import { getMentionProps } from './utils';
import PreviewCard from 'components/PreviewCard';

type RenderPostProps = {
  data: IGetPost;
};

export const RenderPost: React.FC<RenderPostProps> = ({
  data,
}): ReactElement => {
  const content = data?.content?.editor;
  const mentions = data?.mentions ? data.mentions : [];
  const link = data?.link;
  const media = data?.files;

  const postContent = content?.ops?.map((op: DeltaOperation) => {
    switch (true) {
      case op.insert.hasOwnProperty('mention'):
        return (
          <Mention
            value={op.insert.mention?.value}
            {...getMentionProps(mentions, op.insert.mention)}
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
      {postContent}
      {link && (
        <div className="mt-4">
          <PreviewCard metaData={data?.link} className="my-2" />
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
