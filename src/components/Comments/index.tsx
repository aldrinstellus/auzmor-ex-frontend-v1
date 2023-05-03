import React, { useEffect, useState } from 'react';

import { Comment } from './Comment';
import { CommentForm } from './CommentForm';
import like from 'images/like.svg';
import icon from 'images/icon.png';
import { getCommentsApi } from 'mocks/comments';

interface CommentsProps {
  entityId: string;
  commentsData: any;
}

interface IContent {
  text: string;
  html: string;
  editor: string;
}

interface IImage {
  blurHash: string;
}

interface ICreatedBy {
  userId: string;
  fullName: string;
  status: string;
  workLocation: string;
  designation: string;
  department: string;
  profileImage: IImage;
}

// {
//         "content": {
//             "text": "This is a test comment .\n #tag1 #tag2 #tag3",
//             "html": "<p>this is paragraph</p>",
//             "editor": "{\"foo\":\"gghjjj\"}"
//         },
//         "mentions": [],
//         "hashtags": [
//             "tag3",
//             "party",
//             "tag1",
//             "wow"
//         ],
//         "entityType": "post",
//         "entityId": "6448cea1e26516273cd38390",
//         "orgId": "6448b95178b97543ad8046e7",
//         "createdBy": {
//             "userId": "6448b95178b97543ad8046e9",
//             "fullName": "abc@microsoft.com",
//             "status": "ACTIVE",
//             "workLocation": "",
//             "designation": "",
//             "department": "",
//             "profileImage": {
//                 "blurHash": ""
//             }
//         },
//         "createdAt": "2023-04-26T07:14:43.378Z",
//         "updatedAt": "2023-04-26T07:14:43.378Z"
//     }

export interface DataType2 {
  content: IContent;
  mentions: Array<string>;
  hashtags: Array<string>;
  entitype: string;
  entityId: string;
  orgId: string;
  createdBy: ICreatedBy;
  createdAt: string;
  updatedAt: string;
}

export interface DataType {
  id: string;
  body: string;
  username: string;
  userId: string;
  parentId: string | null | undefined;
  createdAt: string;
  designation: string;
  likes: Array<string>;
}
export interface activeCommentsDataType {
  id: string;
  type: string;
}

const Comments: React.FC<CommentsProps> = ({ entityId, commentsData }) => {
  const [commentsD, setCommentsD] = useState<Array<DataType2>>(commentsData);

  const [comments, setComments] = useState<Array<DataType>>([]);
  const [activeComment, setActiveComment] =
    useState<activeCommentsDataType | null>(null);

  const rootComments = comments.filter((Comment) => Comment.parentId === null);

  const createCommentApi = async (text: any, parentId: any = null) => {
    return {
      id: Math.random().toString(36).substr(2, 9),
      body: text,
      parentId,
      userId: '1',
      username: 'John',
      createdAt: new Date().toISOString(),
      designation: 'Talent Acquisition Specialist',
      likes: [],
    };
  };

  const getReplies = (commentId: any) =>
    comments
      .filter((Comment) => Comment.parentId === commentId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

  const addComment = (text: any, parentId: string | null | undefined) => {
    createCommentApi(text, parentId).then((comment) => {
      setComments([comment, ...comments]);
      setActiveComment(null);
    });
  };

  const [replyInputBox, setReplyInputBox] = useState(false);

  useEffect(() => {
    getCommentsApi().then((data) => {
      setComments(data);
    });
  }, []);

  return (
    <div>
      <div className="flex flex-row items-center justify-between p-0">
        <div className="flex-none grow-0 order-none pr-2">
          <img width={32} height={32} src={icon} />
        </div>
        <CommentForm
          handleSubmit={addComment}
          setReplyInputBox={setReplyInputBox}
          className="w-[100%]"
        />
      </div>
      <div className="border-b border-neutral-200 my-4"></div>

      {rootComments.length > 0 && (
        <div>
          {rootComments.map((rootComment) => (
            <Comment
              key={rootComment.id}
              comment={rootComment}
              replies={getReplies(rootComment.id)}
              activeComment={activeComment}
              setActiveComment={setActiveComment}
              addComment={addComment}
              currentUserId={'1'}
              className=""
              replyInputBox={replyInputBox}
              setReplyInputBox={setReplyInputBox}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;
