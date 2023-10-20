import { FC, useRef, ReactNode, useState } from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import Post from 'components/Post';
import { IPost } from 'queries/post';

type PostProps = {
  post: IPost;
  customNode?: ReactNode;
};

type VisibilityProps = {
  isVisible: boolean;
};

const VirtualisedPost: FC<PostProps> = ({ post, customNode = null }) => {
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
              customNode={customNode}
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
