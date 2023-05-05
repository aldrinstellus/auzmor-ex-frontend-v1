import React, { useContext, useEffect } from 'react';
import Modal from 'components/Modal';
import CreatePost from 'components/PostBuilder/components/CreatePost';
import { useMutation } from '@tanstack/react-query';
import { IPost, createPost, updatePost } from 'queries/post';
import CreateAnnouncement from './CreateAnnouncement';
import {
  CreatePostFlow,
  CreatePostContext,
  IEditorValue,
} from 'contexts/CreatePostContext';
import { PostBuilderMode } from '..';

interface ICreatePostModal {
  showModal: boolean;
  setShowModal: (flag: boolean) => void;
  data?: IPost;
  mode: PostBuilderMode;
}

interface IUserMention {
  denotationChar?: string;
  id: string;
  index?: number;
  value: string;
}

const CreatePostModal: React.FC<ICreatePostModal> = ({
  showModal,
  setShowModal,
  data,
  mode,
}) => {
  const {
    activeFlow,
    announcement,
    editorValue,
    setAnnouncement,
    setEditorValue,
  } = useContext(CreatePostContext);

  console.log(data);
  useEffect(() => {
    if (data) {
      setEditorValue(data.content.editor);
      if (data.isAnnouncement) {
        setAnnouncement({ label: 'Custom Date', value: data.announcement.end });
      }
    }
  }, []);

  const createPostMutation = useMutation({
    mutationKey: ['createPostMutation'],
    mutationFn: createPost,
    onError: (error) => console.log(error),
    onSuccess: (data, variables, context) => {
      console.log('data==>', data);
    },
  });

  const updatePostMutation = useMutation({
    mutationKey: ['updatePostMutation'],
    mutationFn: (payload: IPost) =>
      updatePost(payload.id || '', payload as IPost),
  });

  const handleSubmitPost = (content?: IEditorValue) => {
    const userMentionList = content?.json?.ops
      ?.filter((op) => op.insert.mention)
      .map((userItem) => userItem?.insert?.mention?.id);

    if (mode === PostBuilderMode.Create) {
      createPostMutation.mutate({
        content: {
          text: content?.text || editorValue.text,
          html: content?.html || editorValue.html,
          editor: content?.json || editorValue.json,
        },
        type: 'UPDATE',
        mentions: userMentionList || [],
        hashtags: [],
        audience: {
          users: [],
        },
        isAnnouncement: !!announcement,
        announcement: {
          end: announcement?.value || '',
        },
      });
    } else if (PostBuilderMode.Edit) {
      updatePostMutation.mutate({
        content: {
          text: content?.text || editorValue.text,
          html: content?.html || editorValue.html,
          editor: content?.json || editorValue.json,
        },
        type: 'UPDATE',
        mentions: userMentionList || [],
        hashtags: [],
        audience: {
          users: [],
        },
        isAnnouncement: !!announcement,
        announcement: {
          end: announcement?.value || '',
        },
        id: data?.id,
      });
    }
  };

  return (
    <Modal open={showModal} closeModal={() => setShowModal(false)}>
      {activeFlow === CreatePostFlow.CreatePost && (
        <CreatePost
          data={data}
          closeModal={() => setShowModal(false)}
          handleSubmitPost={handleSubmitPost}
        />
      )}
      {activeFlow === CreatePostFlow.CreateAnnouncement && (
        <CreateAnnouncement closeModal={() => setShowModal(false)} />
      )}
    </Modal>
  );
};

export default CreatePostModal;
