import React, { useContext } from 'react';
import Modal from 'components/Modal';
import CreatePost from 'components/PostBuilder/components/CreatePost';
import { useMutation } from '@tanstack/react-query';
import { createPost } from 'queries/post';
import CreateAnnouncement from './CreateAnnouncement';
import {
  CreatePostFlow,
  CreatePostContext,
  IEditorValue,
} from 'contexts/CreatePostContext';

interface ICreatePostModal {
  showModal: boolean;
  setShowModal: (flag: boolean) => void;
  data?: any;
}

const CreatePostModal: React.FC<ICreatePostModal> = ({
  showModal,
  setShowModal,
  data = '',
}) => {
  const { activeFlow, announcement, editorValue } =
    useContext(CreatePostContext);

  const createPostMutation = useMutation({
    mutationKey: ['createPostMutation'],
    mutationFn: createPost,
    onError: (error) => console.log(error),
    onSuccess: (data, variables, context) => {
      console.log('data==>', data);
    },
  });

  const handleSubmitPost = (content?: IEditorValue) => {
    createPostMutation.mutate({
      content: {
        text: content?.text || editorValue.text,
        html: content?.html || editorValue.html,
        editor: content?.json || editorValue.json,
      },
      type: 'UPDATE',
      mentions: [],
      hashtags: [],
      audience: {
        users: [],
      },
      isAnnouncement: !!announcement,
      announcement: {
        end: announcement?.value || '',
      },
    });
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
