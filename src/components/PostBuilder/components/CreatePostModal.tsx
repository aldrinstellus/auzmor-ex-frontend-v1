import React, {
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import Modal from 'components/Modal';
import CreatePost from 'components/PostBuilder/components/CreatePost';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  IMention,
  IPost,
  IPostPayload,
  createPost,
  updatePost,
} from 'queries/post';
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
import { EntityType } from 'queries/files';
import { useUpload, UploadStatus } from 'hooks/useUpload';
import { previewLinkRegex } from 'components/RichTextEditor/config';
import EditMedia from './EditMedia';
import { IMenuItem } from 'components/PopupMenu';
import Icon from 'components/Icon';
import { hideEmojiPalette, quillHashtagConversion, twConfig } from 'utils/misc';
import { useFeedStore } from 'stores/feedStore';
import { toast } from 'react-toastify';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import FailureToast from 'components/Toast/variants/FailureToast';
import { produce } from 'immer';
import CreatePoll from './CreatePoll';
import SchedulePost from './SchedulePost';
import moment from 'moment';
import Audience from './Audience';

export interface IPostMenu {
  id: number;
  label: string;
  icon: ReactNode;
  menuItems: IMenuItem[];
  divider?: boolean;
}

interface ICreatePostModal {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
  data?: IPost;
  mode: PostBuilderMode;
  customActiveFlow?: CreatePostFlow;
}

const CreatePostModal: React.FC<ICreatePostModal> = ({
  open,
  openModal,
  closeModal,
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
    schedule,
    setSchedule,
    audience,
    setAudience,
  } = useContext(CreatePostContext);

  const mediaRef = useRef<IMedia[]>([]);

  const { feed, updateFeed, setFeed } = useFeedStore();

  const queryClient = useQueryClient();

  const { uploadMedia, uploadStatus, useUploadCoverImage } = useUpload();

  // When we need to show create announcement modal directly
  useMemo(() => {
    if (customActiveFlow === CreatePostFlow.CreateAnnouncement) {
      setAnnouncement({
        label: 'Custom Date',
        value: data?.announcement?.end || '',
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
      if (data?.schedule) {
        setSchedule({
          timezone: data.schedule.timeZone,
          date: data.schedule.dateTime,
          time: `${moment(new Date(data.schedule.dateTime)).format('h:mm a')}`,
        });
      }
      setAudience(data?.audience || []);
    }
  }, []);

  const createPostMutation = useMutation({
    mutationKey: ['createPostMutation'],
    mutationFn: createPost,
    onError: (error) => console.log(error),
    onSuccess: async ({
      result,
    }: {
      code: number;
      message: string;
      result: { data: IPost };
    }) => {
      if (!!!result.data.schedule) {
        setFeed({ ...feed, [result.data.id!]: { ...result.data } });
        await queryClient.setQueryData(['feed', { type: [] }], (oldData: any) =>
          produce(oldData, (draft: any) => {
            draft.pages[0].data.result.data = [
              { id: result.data.id },
              ...draft.pages[0].data.result.data,
            ];
          }),
        );
      }
      clearPostContext();
      closeModal();
      if (result.data.schedule) {
        toast(
          <SuccessToast
            content={`Post scheduled for ${moment(
              new Date(result.data.schedule.dateTime),
            ).format('ddd, MMM DD')} at ${moment(
              new Date(result.data.schedule.dateTime),
            ).format('hh:mm a')}`}
            dataTestId="toast-post-scheduled"
          />,
          {
            closeButton: (
              <Icon
                name="closeCircleOutline"
                stroke={twConfig.theme.colors.primary['500']}
                size={20}
              />
            ),
            style: {
              border: `1px solid ${twConfig.theme.colors.primary['300']}`,
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
            },
            autoClose: TOAST_AUTOCLOSE_TIME,
            transition: slideInAndOutTop,
            theme: 'dark',
          },
        );
      }
      await queryClient.invalidateQueries(['feed-announcements-widget']);
      await queryClient.invalidateQueries(['post-announcements-widget']);
    },
  });

  const updatePostMutation = useMutation({
    mutationKey: ['updatePostMutation'],
    mutationFn: (payload: IPostPayload) =>
      updatePost(payload.id || '', payload as IPostPayload),
    onMutate: (variables) => {
      if (variables?.id) {
        const previousData = feed[variables.id];
        updateFeed(variables.id, {
          ...feed[variables.id],
          ...variables,
          files: [
            ...mediaRef.current.filter(
              (media) => !!(variables.files as string[])?.includes(media.id),
            ),
          ],
        } as IPost);
        clearPostContext();
        closeModal();
        return { previousData };
      }
    },
    onError: (error, variables, context) => {
      if (context?.previousData && variables?.id) {
        updateFeed(variables.id, context?.previousData);
      }
      toast(
        <FailureToast
          content="Error updating post"
          dataTestId="post-update-toaster"
        />,
        {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              stroke={twConfig.theme.colors.red['500']}
              size={20}
            />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.red['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: twConfig.theme.colors.neutral[900],
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
          theme: 'dark',
        },
      );
    },
    onSuccess: async () => {
      toast(
        <SuccessToast
          content="Post updated successfully"
          dataTestId="post-update-toaster"
        />,
        {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              stroke={twConfig.theme.colors.primary['500']}
              size={20}
            />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.primary['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: twConfig.theme.colors.neutral[900],
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
          theme: 'dark',
        },
      );
      await queryClient.invalidateQueries(['feed-announcements-widget']);
      await queryClient.invalidateQueries(['post-announcements-widget']);
    },
  });

  const handleSubmitPost = async (content?: IEditorValue, files?: File[]) => {
    let fileIds: string[] = [];
    let uploadedMedia: IMedia[] = [];
    const mentionList: IMention[] = [];
    const hashtagList: string[] = [];

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

    quillHashtagConversion(content?.json)?.ops?.forEach(
      (op: Record<string, any>) => {
        if (op?.insert && op?.insert.mention) {
          mentionList.push(op.insert.mention.id);
        } else if (op.insert && op?.insert?.hashtag) {
          hashtagList.push(op?.insert?.hashtag?.value);
        }
      },
    );

    const previewUrl = isPreviewRemoved
      ? []
      : (content?.text.match(previewLinkRegex) as string[]);

    if (mode === PostBuilderMode.Create) {
      createPostMutation.mutate({
        content: {
          text: content?.text || editorValue.text,
          html: content?.html || editorValue.html,
          editor: content?.json || editorValue.json,
        },
        type: 'UPDATE',
        files: fileIds,
        mentions: mentionList || [],
        hashtags: hashtagList || [],
        audience,
        isAnnouncement: !!announcement,
        announcement: {
          end: announcement?.value || '',
        },
        link: previewUrl && previewUrl[0],
        schedule: schedule
          ? {
              timeZone: schedule?.timezone || '',
              dateTime: schedule?.date || '',
            }
          : null,
      });
    } else if (PostBuilderMode.Edit) {
      mediaRef.current = [...media, ...uploadedMedia];
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
      mediaRef.current = sortedIds.map(
        (id: string) => mediaRef.current.find((media) => media.id === id)!,
      );
      updatePostMutation.mutate({
        content: {
          text: content?.text || editorValue.text,
          html: content?.html || editorValue.html,
          editor: content?.json || editorValue.json,
        },
        type: 'UPDATE',
        files: sortedIds,
        mentions: mentionList || [],
        hashtags: hashtagList || [],
        audience,
        isAnnouncement: !!announcement,
        announcement: {
          end: announcement?.value || '',
        },
        id: data?.id,
        link: previewUrl && previewUrl[0],
        schedule: schedule
          ? {
              timeZone: schedule?.timezone || '',
              dateTime: schedule?.date || '',
            }
          : null,
      });
    }
  };

  const loading =
    createPostMutation.isLoading ||
    updatePostMutation.isLoading ||
    uploadStatus === UploadStatus.Uploading;

  return (
    <>
      <Modal
        open={open}
        closeModal={() => {
          clearPostContext();
        }}
        dataTestId={
          activeFlow === CreatePostFlow.SchedulePost
            ? 'createpost-scheduledpost-modal'
            : ''
        }
      >
        {activeFlow === CreatePostFlow.CreatePost && (
          <CreatePost
            data={data}
            closeModal={() => {
              if (loading) {
                return null;
              }
              hideEmojiPalette();
              return closeModal();
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
              closeModal();
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
              closeModal();
            }}
          />
        )}
        {activeFlow === CreatePostFlow.CreatePoll && (
          <CreatePoll
            closeModal={() => {
              closeModal();
              clearPostContext();
            }}
          />
        )}
        {activeFlow === CreatePostFlow.SchedulePost && (
          <SchedulePost
            closeModal={() => {
              closeModal();
              clearPostContext();
            }}
          />
        )}
        {activeFlow === CreatePostFlow.Audience && (
          <Audience
            closeModal={() => {
              closeModal();
              clearPostContext();
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
