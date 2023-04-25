import React, { ReactElement } from 'react';
import { Delta, DeltaOperation } from 'quill';
import { Mention } from './components/Mention';
import { Hashtag } from './components/Hashtag';
import { Emoji } from './components/Emoji';
import { Text } from './components/Text';

type RenderQuillDeltaProps = {
  delta: Delta;
};

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

  return <div>{content}</div>;
};
