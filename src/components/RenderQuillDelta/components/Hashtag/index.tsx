import React, { ReactElement } from 'react';
import { Mention } from '../Mention';

type HashtagProps = {
  value: string;
};

export const Hashtag: React.FC<HashtagProps> = (
  props: HashtagProps,
): ReactElement => {
  return <Mention value={props.value} />;
};
