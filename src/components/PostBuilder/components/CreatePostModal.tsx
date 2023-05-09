import React, { useContext, useEffect } from 'react';
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
import EditPost from './EditPost';
import { UploadStatus } from 'queries/files';

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
    setMedia,
    clearPostContext,
    media,
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
        setMedia(data?.files);
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
      setShowModal(false);
    },
  });

  const handleSubmitPost = async (content?: IEditorValue, files?: File[]) => {
    let fileIds: string[] = [];
    if (files?.length) {
      console.log(files.length, '<=== length');
      fileIds = await uploadMedia(files, EntityType.Post);
    }
    const userMentionList = content?.json?.ops
      ?.filter((op) => op.insert.mention)
      .map((userItem) => userItem?.insert?.mention?.id);

    const previewUrl = content?.text.match(previewLinkRegex) as string[];

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
        <CreateAnnouncement closeModal={() => setShowModal(false)} />
      )}
      {activeFlow === CreatePostFlow.EditPost && (
        <EditPost closeModal={() => setShowModal(false)} />
      )}
    </Modal>
  );
};

export default CreatePostModal;
