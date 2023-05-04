import React, { ReactElement } from 'react';
import { Delta, DeltaOperation } from 'quill';
import { Mention } from './components/Mention';
import { Hashtag } from './components/Hashtag';
import { Emoji } from './components/Emoji';
import { Text } from './components/Text';
import PreviewLink, { LinkMetadataProps } from 'components/PreviewLink';
import MediaPreview, { IMedia, Mode } from 'components/MediaPreview';

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

const media = [
  {
    type: 'image',
    url: 'https://images.unsplash.com/photo-1683130565572-61af42023da6?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=640',
    className: 'object-cover w-48 h-48',
  },
  {
    type: 'image',
    url: 'https://media.tenor.com/o656qFKDzeUAAAAC/rick-astley-never-gonna-give-you-up.gif',
    className: 'object-cover w-48 h-48',
  },
  {
    type: 'image',
    url: 'https://media.tenor.com/O2RBK9klEMYAAAAC/homer-simpson-homer.gif',
    className: 'object-cover w-48 h-48',
  },
  {
    type: 'image',
    url: 'https://img.freepik.com/free-vector/set-ten-clover-leaves-flat-style_1017-24189.jpg',
    className: 'object-cover w-48 h-48',
  },
] as IMedia[];

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
      <div className="mt-4">
        <PreviewLink linkMetadata={linkMetadata} />
      </div>
      <div className="mt-4">
        <MediaPreview media={media} mode={Mode.View} />
      </div>
    </div>
  );
};
