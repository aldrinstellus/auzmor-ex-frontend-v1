import Header from 'components/ModalHeader';
import React, { useContext } from 'react';
import Footer from './Footer';
import { CreatePostContext, CreatePostFlow } from 'contexts/CreatePostContext';
import Body from './Body';

type CreatePollProps = {
  closeModal: () => void;
};

const CreatePoll: React.FC<CreatePollProps> = ({ closeModal }) => {
  const { setActiveFlow } = useContext(CreatePostContext);
  return (
    <>
      <Header
        title="Create a poll"
        onBackIconClick={() => setActiveFlow(CreatePostFlow.CreatePost)}
        onClose={closeModal}
      />
      <Body />
      <Footer />
    </>
  );
};

export default CreatePoll;
