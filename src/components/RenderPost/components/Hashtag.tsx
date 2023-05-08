import React, { ReactElement } from 'react';

type HashtagProps = {
  value: string;
};

const Hashtag: React.FC<HashtagProps> = ({ value }): ReactElement => {
  return <span onClick={() => {}} className="hashtag">{`#${value}`}</span>;
};

export default Hashtag;
