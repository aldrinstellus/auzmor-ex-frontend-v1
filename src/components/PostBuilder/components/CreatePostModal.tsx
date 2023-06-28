import React, { ReactNode, useContext, useEffect, useMemo } from 'react';
import Modal from 'components/Modal';
import CreatePost from 'components/PostBuilder/components/CreatePost';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IPost, createPost, updatePost } from 'queries/post';
import CreateAnnouncement, {
  CreateAnnouncementMode,
} from './CreateAnnouncement';
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
import Icon from 'components/Icon';
import { hideEmojiPalette } from 'utils/misc';

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
  customActiveFlow?: CreatePostFlow;
}

const CreatePostModal: React.FC<ICreatePostModal> = ({
  showModal,
  setShowModal,
  data,
  mode,
  customActiveFlow = CreatePostFlow.CreatePost,
}) => {
  const {
    activeFlow,
    setActiveFlow,
    announcement,
    editorValue,
    setAnnouncement,
    setEditorValue,
    isPreviewRemoved,
    setMedia,
    media,
    clearPostContext,
    coverImageMap,
    showFullscreenVideo,
    setShowFullscreenVideo,
  } = useContext(CreatePostContext);

  const queryClient = useQueryClient();

  const { uploadMedia, uploadStatus, useUploadCoverImage } = useUpload();

  // When we need to show create announcement modal directly
  useMemo(() => {
    if (customActiveFlow === CreatePostFlow.CreateAnnouncement) {
      setAnnouncement({
        label: 'Custom Date',
        value: data?.announcement.end || '',
      });
      setActiveFlow(CreatePostFlow.CreateAnnouncement);
    }
  }, [customActiveFlow]);

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
    let uploadedMedia: IMedia[] = [];
    if (files?.length) {
      uploadedMedia = await uploadMedia(files, EntityType.Post);
      await useUploadCoverImage(
        coverImageMap.map((map) => {
          return {
            fileId:
              uploadedMedia.find((media) => media.name === map.videoName)?.id ||
              media.find((media) => media.name === map.videoName)?.id ||
              '',
            coverImageUrl:
              uploadedMedia.find((media) => media.name === map.coverImageName)
                ?.original || '',
          };
        }),
      );
      fileIds = uploadedMedia
        .filter((media: IMedia) => {
          if (coverImageMap.length) {
            return !!!coverImageMap.find(
              (map) => map.coverImageName === media.name,
            );
          } else return true;
        })
        .sort((a: IMedia, b: IMedia) => {
          const aIndex = files.findIndex((file: File) => file.name === a.name);
          const bIndex = files.findIndex((file: File) => file.name === b.name);
          if (aIndex && bIndex) {
            return aIndex - bIndex;
          } else return 0;
        })
        .map((media: IMedia) => media.id);
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
      const sortedIds = [
        ...fileIds,
        ...media
          .filter((eachMedia: IMedia) => eachMedia.id !== '')
          .map((eachMedia: IMedia) => eachMedia.id),
      ].sort((a: string, b: string) => {
        const aIndex = media.findIndex(
          (eachMedia: IMedia) =>
            eachMedia.name ===
            (media.find((value: IMedia) => value.id === a)?.name ||
              uploadedMedia.find((value: IMedia) => value.id === a)?.name),
        );
        const bIndex = media.findIndex(
          (eachMedia: IMedia) =>
            eachMedia.name ===
            (media.find((value: IMedia) => value.id === b)?.name ||
              uploadedMedia.find((value: IMedia) => value.id === b)?.name),
        );
        return aIndex - bIndex;
      });
      updatePostMutation.mutate(
        {
          content: {
            text: content?.text || editorValue.text,
            html: content?.html || editorValue.html,
            editor: content?.json || editorValue.json,
          },
          type: 'UPDATE',
          files: sortedIds,
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
    <>
      <Modal
        open={showModal}
        closeModal={() => {
          clearPostContext();
        }}
      >
        {activeFlow === CreatePostFlow.CreatePost && (
          <CreatePost
            data={data}
            closeModal={() => {
              if (loading) {
                return null;
              }
              hideEmojiPalette();
              return setShowModal(false);
            }}
            handleSubmitPost={handleSubmitPost}
            isLoading={loading}
            dataTestId="feed-createpost"
          />
        )}
        {activeFlow === CreatePostFlow.CreateAnnouncement && (
          <CreateAnnouncement
            closeModal={() => {
              clearPostContext();
              setShowModal(false);
            }}
            mode={
              customActiveFlow === CreatePostFlow.CreateAnnouncement
                ? CreateAnnouncementMode.DIRECT
                : CreateAnnouncementMode.POST_BUILDER
            }
            data={data}
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
      {!!showFullscreenVideo && (
        <Modal
          open={!!showFullscreenVideo}
          closeModal={() => setShowFullscreenVideo(false)}
        >
          {!!showFullscreenVideo && (
            <video src={showFullscreenVideo.original} controls />
          )}
          <Icon
            name="close"
            className="absolute top-6 right-6"
            fill={'#fff'}
            onClick={() => setShowFullscreenVideo(false)}
          />
        </Modal>
      )}
    </>
  );
};

export default CreatePostModal;
