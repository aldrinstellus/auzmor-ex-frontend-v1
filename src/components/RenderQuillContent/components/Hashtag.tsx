import { FC, ReactElement, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

type HashtagProps = {
  value: string;
};

const Hashtag: FC<HashtagProps> = ({ value }): ReactElement => {
  const hashtagRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const { channelId } = useParams();
  let navigateTo = '/feed';

  if (channelId) {
    navigateTo = `/channels/${channelId}`;
  }

  return (
    <span
      onClick={() => {
        if (hashtagRef?.current) {
          navigate({
            pathname: navigateTo,
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
