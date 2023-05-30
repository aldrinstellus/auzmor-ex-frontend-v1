import React, { ReactNode, useContext, useEffect } from 'react';
import Modal from 'components/Modal';
import CreatePost from 'components/PostBuilder/components/CreatePost';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IPost, createPost, updatePost } from 'queries/post';
import CreateAnnouncement from './CreateAnnouncement';
import {
  CreatePostFlow,
  CreatePostContext,
  IEditorValue,
  IMedia,
} from 'contexts/CreatePostContext';
import { PostBuilderMode } from '..';
import { EntityType, useUpload } from 'queries/files';
import { previewLinkRegex } from 'components/RichTextEditor/config';
import EditMedia from './EditMedia';
import { UploadStatus } from 'queries/files';
import { IMenuItem } from 'components/PopupMenu';

export interface IPostMenu {
  id: number;
  label: string;
  icon: ReactNode;
  menuItems: IMenuItem[];
  divider?: boolean;
}

interface ICreatePostModal {
  showModal: boolean;
  setShowModal: (flag: boolean) => void;
  data?: IPost;
  mode: PostBuilderMode;
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
    isPreviewRemoved,
    setMedia,
    media,
    clearPostContext,
  } = useContext(CreatePostContext);
  const queryClient = useQueryClient();

  const { uploadMedia, uploadStatus } = useUpload();

  useEffect(() => {
    if (data) {
      setEditorValue(data.content.editor);
      if (data.isAnnouncement) {
        setAnnouncement({ label: 'Custom Date', value: data.announcement.end });
      }
      if (data?.files?.length) {
        setMedia(data?.files as IMedia[]);
      }
    }
  }, []);

  const createPostMutation = useMutation({
    mutationKey: ['createPostMutation'],
    mutationFn: createPost,
    onError: (error) => console.log(error),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['feed']);
      await queryClient.invalidateQueries(['announcements-widget']);
      await queryClient.invalidateQueries(['my-profile-feed']);
      await queryClient.invalidateQueries(['people-profile-feed']);
      setShowModal(false);
    },
  });

  const updatePostMutation = useMutation({
    mutationKey: ['updatePostMutation'],
    mutationFn: (payload: IPost) =>
      updatePost(payload.id || '', payload as IPost),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['feed']);
      await queryClient.invalidateQueries(['announcements-widget']);
      await queryClient.invalidateQueries(['my-profile-feed']);
      await queryClient.invalidateQueries(['people-profile-feed']);
      setShowModal(false);
    },
  });

  const handleSubmitPost = async (content?: IEditorValue, files?: File[]) => {
    let fileIds: string[] = [];
    if (files?.length) {
      fileIds = (await uploadMedia(files, EntityType.Post)).map(
        (media: IMedia) => media.id,
      );
    }
    const userMentionList = content?.json?.ops
      ?.filter((op) => op.insert.mention)
      .map((userItem) => userItem?.insert?.mention?.id);

    const previewUrl = isPreviewRemoved
      ? []
      : (content?.text.match(previewLinkRegex) as string[]);

    if (mode === PostBuilderMode.Create) {
      createPostMutation.mutate(
        {
          content: {
            text: content?.text || editorValue.text,
            html: content?.html || editorValue.html,
            editor: content?.json || editorValue.json,
          },
          type: 'UPDATE',
          files: fileIds,
          mentions: userMentionList || [],
          hashtags: [],
          audience: {
            users: [],
          },
          isAnnouncement: !!announcement,
          announcement: {
            end: announcement?.value || '',
          },
          link: previewUrl && previewUrl[0],
        },
        {
          onSuccess: () => {
            clearPostContext();
            setShowModal(false);
          },
        },
      );
    } else if (PostBuilderMode.Edit) {
      updatePostMutation.mutate(
        {
          content: {
            text: content?.text || editorValue.text,
            html: content?.html || editorValue.html,
            editor: content?.json || editorValue.json,
          },
          type: 'UPDATE',
          files: [
            ...fileIds,
            ...media
              .filter((eachMedia: IMedia) => eachMedia.id !== '')
              .map((eachMedia: IMedia) => eachMedia.id),
          ],
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
          link: previewUrl && previewUrl[0],
        },
        { onSuccess: () => setShowModal(false) },
      );
    }
  };

  const loading =
    createPostMutation.isLoading ||
    updatePostMutation.isLoading ||
    uploadStatus === UploadStatus.Uploading;

  return (
    <Modal
      open={showModal}
      closeModal={() => {
        clearPostContext();
        setShowModal(false);
      }}
    >
      {activeFlow === CreatePostFlow.CreatePost && (
        <CreatePost
          data={data}
          closeModal={() => {
            if (loading) {
              return null;
            }
            return setShowModal(false);
          }}
          handleSubmitPost={handleSubmitPost}
          isLoading={loading}
        />
      )}
      {activeFlow === CreatePostFlow.CreateAnnouncement && (
        <CreateAnnouncement
          closeModal={() => {
            clearPostContext();
            setShowModal(false);
          }}
        />
      )}
      {activeFlow === CreatePostFlow.EditMedia && (
        <EditMedia
          closeModal={() => {
            clearPostContext();
            setShowModal(false);
          }}
        />
      )}
    </Modal>
  );
};

export default CreatePostModal;
