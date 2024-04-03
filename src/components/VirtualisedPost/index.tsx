import { FC, useRef, useState } from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import Post from 'components/Post';
import { IPost } from 'queries/post';
import { IComment } from 'components/Comments';

type PostProps = {
  post: IPost;
  comments?: IComment[];
};

type VisibilityProps = {
  isVisible: boolean;
};

const VirtualisedPost: FC<PostProps> = ({ post, comments = [] }) => {
  const cardRef = useRef<HTMLInputElement>(null);
  const [hasChanges, setHasChanges] = useState(false);

  return (
    <div ref={cardRef}>
      <VisibilitySensor
        partialVisibility
        resizeCheck
        scrollCheck
        offset={{ top: -600, bottom: -600 }}
      >
        {({ isVisible }: VisibilityProps) =>
          isVisible || hasChanges ? (
            <Post
              post={post}
              comments={comments}
              setHasChanges={setHasChanges}
            />
          ) : (
            <div style={{ minHeight: cardRef?.current?.clientHeight || 400 }} />
          )
        }
      </VisibilitySensor>
    </div>
  );
};

export default VirtualisedPost;
