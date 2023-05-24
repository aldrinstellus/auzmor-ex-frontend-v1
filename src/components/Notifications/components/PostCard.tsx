import Card from 'components/Card';
import Divider, { Variant } from 'components/Divider';
import React, { useEffect, useRef } from 'react';

type PostCardProps = {
  content: string;
  image?: string;
  comment?: string;
};

const PostCard: React.FC<PostCardProps> = ({
  content,
  image = 'https://img.freepik.com/free-vector/hand-drawn-japanese-illustration-cherry-tree-petals_23-2149601832.jpg?w=1380&t=st=1684910063~exp=1684910663~hmac=93792f641251bd028a5aedf75ecfcff9c396cfdb2084f3a7f17749e4b7786a52',
  comment,
}) => {
  return (
    <Card className="border-neutral-200 border-1 max-w-xs">
      {/* Comment */}
      {!comment && (
        <div>
          <p className="my-4 ml-4 text-sm text-neutral-900 font-medium line-clamp-1">
            Comment Comment Comment Comment Comment Comment Comment Comment
            Comment Comment Comment Comment
          </p>
          <Divider />
        </div>
      )}
      {/* Post */}
      <div className="flex">
        {image && <img src={image} width={150} className="rounded-md" />}
        <p
          className="m-4 text-sm text-neutral-500 line-clamp-3"
          id="postContent"
          dangerouslySetInnerHTML={{
            __html: content,
          }}
        ></p>
      </div>
    </Card>
  );
};

export default PostCard;
