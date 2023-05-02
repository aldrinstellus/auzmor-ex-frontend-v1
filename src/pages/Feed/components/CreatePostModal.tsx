import React, { useContext, useRef, useState } from 'react';
import Modal from 'components/Modal';
import CreatePost from 'components/CreatePost';
import { useMutation } from '@tanstack/react-query';
import { createPost } from 'queries/post';
import CreateAnnouncement from './CreateAnnouncement';
import { CreatePostFlow, CreatePostContext } from 'contexts/CreatePostContext';

interface ICreatePostModal {
  showModal: boolean;
  setShowModal: (flag: boolean) => void;
}

const CreatePostModal: React.FC<ICreatePostModal> = ({
  showModal,
  setShowModal,
}) => {
  const { activeFlow, announcement, setAnnouncement } =
    useContext(CreatePostContext);
  const [editorValue, setEditorValue] = useState<{
    html: string;
    text: string;
    json: Record<string, any>;
  }>({ html: '', json: {}, text: '' });

  const announcementFormRef = useRef();

  const createPostMutation = useMutation({
    mutationKey: ['createPostMutation'],
    mutationFn: createPost,
    onError: (error) => console.log(error),
    onSuccess: (data, variables, context) => {
      console.log('data==>', data);
    },
  });

  const handleSubmitPost = () => {
    createPostMutation.mutate({
      content: {
        text: editorValue.html,
        html: editorValue.html,
        editor: JSON.stringify(editorValue.json),
      },
      type: 'UPDATE',
      mentions: [],
      hashtags: [],
      audience: {
        users: [],
      },
      isAnnouncement: true,
      announcement: {
        end: '',
      },
    });
  };

  return (
    <Modal open={showModal} closeModal={() => setShowModal(false)}>
      {activeFlow === CreatePostFlow.CreatePost && (
        <CreatePost
          onChangeEditor={(content) => setEditorValue({ ...content })}
        />
<<<<<<< HEAD
      )}
      {activeFlow === CreatePostFlow.CreateAnnouncement && (
        <CreateAnnouncement ref={announcementFormRef} />
      )}
    </Modal>
=======
      ),
      footer: <Footer />,
      showBackIcon: false,
      onBackIconClick: () => {},
    },
    [CreatePostFlow.CreateAnnouncement]: {
      title: 'Create an announcement',
      body: (
        <CreateAnnouncement
          ref={announcementFormRef}
          announcement={announcement}
          setAnnouncement={setAnnouncement}
        />
      ),
      footer: <AnnouncementFooter />,
      showBackIcon: true,
      onBackIconClick: () => setActiveFlow(CreatePostFlow.CreatePost),
    },
  };

  return (
    <div>
      <Modal open={showModal} closeModal={() => setShowModal(false)}>
        <div>
          {createPostMap[activeFlow].title}
          {createPostMap[activeFlow].body}
          {createPostMap[activeFlow].footer}
        </div>
      </Modal>
      {/* <Modal
        open={showModal}
        closeModal={() => setShowModal(false)}
        title={createPostMap[activeFlow].title}
        body={createPostMap[activeFlow].body}
        footer={createPostMap[activeFlow].footer}
        showBackIcon={createPostMap[activeFlow].showBackIcon || false}
        onBackIconClick={createPostMap[activeFlow].onBackIconClick}
      /> */}
    </div>
>>>>>>> develop
  );
};

export default CreatePostModal;
