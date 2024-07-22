import { FC, useRef, useState } from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import Post from 'components/Post';

type PostProps = {
  postId: string;
  commentIds?: string[];
};

type VisibilityProps = {
  isVisible: boolean;
};

const VirtualisedPost: FC<PostProps> = ({ postId, commentIds = [] }) => {
  const cardRef = useRef<HTMLDivElement>(null);
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
              postId={postId}
              commentIds={commentIds}
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
