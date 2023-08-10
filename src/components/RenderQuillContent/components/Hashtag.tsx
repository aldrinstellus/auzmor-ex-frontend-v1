import React, { ReactElement, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

type HashtagProps = {
  value: string;
};

const Hashtag: React.FC<HashtagProps> = ({ value }): ReactElement => {
  const hashtagRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  return (
    <span
      onClick={() => {
        if (hashtagRef?.current) {
          navigate({
            pathname: '/feed',
            search: hashtagRef?.current?.innerHTML
              ? `?hashtag=${hashtagRef?.current?.innerHTML}`
              : '',
          });
        }
      }}
      className="hashtag"
    >
      #
      <span ref={hashtagRef} data-testid={`feedpage-hashtag-${value}`}>
        {value}
      </span>
    </span>
  );
};

export default Hashtag;
