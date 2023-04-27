import React, { ReactNode, useState } from 'react';
import Button from 'components/Button';
import Modal from 'components/Modal';
import CreatePost from 'components/CreatePost';
import Icon from 'components/Icon';
import Tooltip from 'components/Tooltip';
import Divider, { Variant as DividerVariant } from 'components/Divider';
import { postTypeMapIcons } from '..';
import { useMutation } from '@tanstack/react-query';
import { createPost } from 'queries/post';

interface ICreatePostModal {
  showModal: boolean;
  setShowModal: (flag: boolean) => void;
}

const CreatePostModal: React.FC<ICreatePostModal> = ({
  showModal,
  setShowModal,
}) => {
  const [editorValue, setEditorValue] = useState<{
    html: string;
    json: Record<string, any>;
  }>({ html: '', json: {} });

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

  const Header: React.FC = () => (
    <div className="flex items-center justify-between h-14 p-4 border-b border-solid">
      <h3 className="text-lg text-black font-['manrope'] font-extrabold">
        Create a post
      </h3>
      <button
        className="p-1 ml-auto bg-transparent border-0 text-black opacity-1 float-right leading-none outline-none focus:outline-none"
        onClick={() => {}}
      >
        <span className="bg-transparent text-black opacity-1 h-8 w-8 text-3xl block outline-none focus:outline-none">
          ×
        </span>
      </button>
    </div>
  );

  const Footer: React.FC = () => (
    <div className="flex justify-between items-center h-16 p-6 bg-blue-50">
      <div className="flex">
        {postTypeMapIcons.map((type) => (
          <div className="mr-4" key={type.id}>
            <Tooltip tooltipContent={type.label}>
              <div className="flex justify-center items-center w-8 h-8 bg-white border border-neutral-200 rounded-7xl">
                {type.icon}
              </div>
            </Tooltip>
          </div>
        ))}
        <div className="flex justify-center items-center w-8 h-8 mr-2">
          <Icon name="moreOutline" stroke="#000000" />
        </div>
        <Divider variant={DividerVariant.Vertical} className="!h-8" />
      </div>
      <div className="flex items-center">
        <div></div>
        <Button label={'Post'} onClick={handleSubmitPost} />
      </div>
    </div>
  );

  return (
    <div>
      <Modal
        open={showModal}
        closeModal={() => {
          setShowModal(false);
        }}
        title="Create a post"
        body={
          <CreatePost
            onChangeEditor={(content) => {
              console.log(content);
              setEditorValue({ html: content.html, json: content.json });
            }}
          />
        }
        footer={<Footer />}
      />
    </div>
  );
};

export default CreatePostModal;
