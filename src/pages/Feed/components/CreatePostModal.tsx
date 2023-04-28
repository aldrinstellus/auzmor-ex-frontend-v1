import React, { ReactNode, useRef, useState } from 'react';
import Button, { Variant as ButtonVariant } from 'components/Button';
import Modal from 'components/Modal';
import CreatePost from 'components/CreatePost';
import Icon from 'components/Icon';
import Tooltip from 'components/Tooltip';
import Divider, { Variant as DividerVariant } from 'components/Divider';
import { postTypeMapIcons } from '..';
import { useMutation } from '@tanstack/react-query';
import { createPost } from 'queries/post';
import PopupMenu from 'components/PopupMenu';
import { twConfig } from 'utils/misc';
import CreateAnnouncement from './CreateAnnouncement';

interface ICreatePostModal {
  showModal: boolean;
  setShowModal: (flag: boolean) => void;
}

export interface IAnnouncement {
  label: string;
  value: string;
}

enum CreatePostFlow {
  CreatePost = 'CREATE_POST',
  CreateAnnouncement = 'CREATE_ANNOUNCEMENT',
}

const CreatePostModal: React.FC<ICreatePostModal> = ({
  showModal,
  setShowModal,
}) => {
  const [editorValue, setEditorValue] = useState<{
    html: string;
    text: string;
    json: Record<string, any>;
  }>({ html: '', json: {}, text: '' });

  const [activeFlow, setActiveFlow] = useState(CreatePostFlow.CreatePost);
  const [announcement, setAnnouncement] = useState<null | IAnnouncement>(null);
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

  const Footer: React.FC = () => (
    <div className="flex justify-between items-center h-16 p-6 bg-blue-50">
      <div className="flex relative">
        {postTypeMapIcons.map((type) => (
          <PopupMenu
            triggerNode={
              <div className="mr-4">
                <Tooltip tooltipContent={type.label}>
                  <div className="flex justify-center items-center w-8 h-8 bg-white border border-neutral-200 rounded-7xl">
                    {type.icon}
                  </div>
                </Tooltip>
              </div>
            }
            menuItems={type.menuItems}
            key={type.id}
          />
        ))}
        <PopupMenu
          triggerNode={
            <div className="flex justify-center items-center w-8 h-8 mr-2">
              <Icon name="moreOutline" stroke="#000000" />
            </div>
          }
          menuItems={[
            {
              renderNode: (
                <div
                  className="flex px-6 py-3 items-center hover:bg-primary-50"
                  onClick={() => {
                    setActiveFlow(CreatePostFlow.CreateAnnouncement);
                  }}
                >
                  <Icon
                    name="speaker"
                    size={16}
                    className="p-2 rounded-7xl border mr-2.5 bg-white"
                    fill={twConfig.theme.colors.primary['500']}
                  />
                  <div className="text-sm text-neutral-900 font-medium whitespace-nowrap">
                    Share as an announcement
                  </div>
                </div>
              ),
            },
            {
              renderNode: (
                <div className="flex px-6 py-3 items-center hover:bg-primary-50">
                  <Icon
                    name="draft"
                    size={16}
                    className="p-2 rounded-7xl border mr-2.5 bg-white"
                    fill={twConfig.theme.colors.primary['500']}
                  />
                  <div className="text-sm text-neutral-900 font-medium whitespace-nowrap">
                    Save as drafts
                  </div>
                </div>
              ),
            },
          ]}
        />

        <Divider variant={DividerVariant.Vertical} className="!h-8" />
      </div>
      <div className="flex items-center">
        <div></div>
        <Button label={'Post'} onClick={handleSubmitPost} />
      </div>
    </div>
  );

  const AnnouncementFooter: React.FC = () => {
    return (
      <div className="flex justify-end items-center h-16 p-6 bg-blue-50">
        <Button
          variant={ButtonVariant.Secondary}
          label="Back"
          className="mr-3"
          onClick={() => setActiveFlow(CreatePostFlow.CreatePost)}
        />
        <Button
          label={'Post'}
          onClick={() => {
            (announcementFormRef?.current as any).getAnnouncemntData();
            setActiveFlow(CreatePostFlow.CreatePost);
          }}
        />
      </div>
    );
  };

  const createPostMap = {
    [CreatePostFlow.CreatePost]: {
      title: 'Create a post',
      body: (
        <CreatePost
          onChangeEditor={(content) => setEditorValue({ ...content })}
          announcement={announcement}
        />
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
      <Modal
        open={showModal}
        closeModal={() => setShowModal(false)}
        title={createPostMap[activeFlow].title}
        body={createPostMap[activeFlow].body}
        footer={createPostMap[activeFlow].footer}
        showBackIcon={createPostMap[activeFlow].showBackIcon || false}
        onBackIconClick={createPostMap[activeFlow].onBackIconClick}
      />
    </div>
  );
};

export default CreatePostModal;
