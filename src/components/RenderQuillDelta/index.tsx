import React, { ReactElement } from 'react';
import { Delta, DeltaOperation } from 'quill';
import { Mention } from './components/Mention';
import { Hashtag } from './components/Hashtag';
import { Emoji } from './components/Emoji';
import { Text } from './components/Text';
import PreviewLink, { LinkMetadataProps } from 'components/PreviewLink';

type RenderQuillDeltaProps = {
  delta: Delta;
};

const linkMetadata = {
  title: 'Testing',
  image:
    'https://img.freepik.com/free-vector/set-ten-clover-leaves-flat-style_1017-24189.jpg',
  description: 'Some description',
  favicon:
    'https://static.vecteezy.com/system/resources/previews/003/171/355/large_2x/objective-lens-icon-with-six-rainbow-colors-vector.jpg',
  url: 'https://auzmor.com',
  themeColor: '#000000',
} as LinkMetadataProps;

export const RenderQuillDelta: React.FC<RenderQuillDeltaProps> = (
  props: RenderQuillDeltaProps,
): ReactElement => {
  const content = props?.delta?.ops?.map((op: DeltaOperation) => {
    switch (true) {
      case op.insert.hasOwnProperty('mention'):
        return <Mention value={op.insert.mention?.value} />;
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
      {content}
      <div className="mt-4 -mb-4">
        <PreviewLink linkMetadata={linkMetadata} />
      </div>
    </div>
  );
};
