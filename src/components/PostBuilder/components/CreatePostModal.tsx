import { FC, ReactNode, useContext, useEffect, useMemo, useRef } from 'react';
import Modal from 'components/Modal';
import CreatePost from 'components/PostBuilder/components/CreatePost';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AudienceEntityType,
  IMention,
  IPost,
  IPostPayload,
  PostType,
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
import {
  hideEmojiPalette,
  isRegularPost,
  quillHashtagConversion,
  removeEmptyLines,
} from 'utils/misc';
import { useFeedStore } from 'stores/feedStore';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { produce } from 'immer';
import CreatePoll from './CreatePoll';
import SchedulePost from './SchedulePost';
import moment from 'moment';
import Audience from './Audience';
import CreateShoutout from './Shoutout';
import { afterXUnit } from 'utils/time';
import useRole from 'hooks/useRole';
import { useCreatePostUtilityStore } from 'stores/createPostUtilityStore';
import useModal from 'hooks/useModal';
import ConfirmationBox from 'components/ConfirmationBox';
import WelcomePost from 'images/ChannelCover/WelcomePost.png';
import { useChannelStore } from 'stores/channelStore';
import { useParams } from 'react-router-dom';

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

const CreatePostModal: FC<ICreatePostModal> = ({
  open,
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
    isPreviewRemoved,
    media,
    clearPostContext,
    coverImageMap,
    showFullscreenVideo,
    setShowFullscreenVideo,
    schedule,
    setSchedule,
    poll,
    setPoll,
    audience,
    shoutoutUsers,
    shoutoutUserIds,
    setShoutoutUserIds,
    postType,
    setShoutoutUsers,
    inputImgRef,
    isEmpty,
    setEditorValue,
    setUploads,
  } = useContext(CreatePostContext);
  const { channelId = '' } = useParams();
  const channelData = useChannelStore((state) => state.channels)[channelId];

  const [confirm, showConfirm, closeConfirm] = useModal();

  const preventMultipleClickRef = useRef<boolean>(true);

  const mediaRef = useRef<IMedia[]>([]);

  const { feed, activeFeedPostCount, updateFeed, setFeed } = useFeedStore();

  const queryClient = useQueryClient();

  const { uploadMedia, uploadStatus, useUploadCoverImage } = useUpload();

  const { isAdmin } = useRole();
  const openCreatePostWithMedia = useCreatePostUtilityStore(
    (state) => state.openCreatePostWithMedia,
  );
  const reset = useCreatePostUtilityStore((state) => state.reset);

  useEffect(() => {
    if (
      openCreatePostWithMedia &&
      inputImgRef?.current &&
      preventMultipleClickRef.current
    ) {
      preventMultipleClickRef.current = false;
      inputImgRef?.current && inputImgRef?.current?.click();
    }
    reset();
  }, []);
  const welcomeContent = useMemo(
    () => ({
      text: ' ',
      html: ' ',
      editor: {
        ops: [
          {
            attributes: {
              color: '#171717',
            },
            insert: `Hello everyone! Welcome to the ${channelData?.name} channel 🎉`,
          },
          {
            insert: '\n',
          },
        ],
      },
    }),
    [channelData],
  );
  useEffect(() => {
    if (customActiveFlow !== CreatePostFlow.WelcomePost) return;
    let img: any = null;
    const loadImage = () => {
      setEditorValue(welcomeContent);
      const selectedImage = WelcomePost;
      img = new Image();
      img.src = selectedImage;
      img.crossOrigin = 'anonymous';
      img.onload = handleImageLoad;
    };

    const handleImageLoad = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = 590;
      canvas.height = 260;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], 'welcomePost.png', {
              type: blob.type,
            });
            setUploads([file]);
          }
        }, 'image/png');
      }
    };

    loadImage();
    setActiveFlow(CreatePostFlow.CreatePost);
    return () => {
      if (img) {
        img.onload = null;
      }
    };
  }, [customActiveFlow]);
  // When we need to show create announcement modal directly
  useMemo(() => {
    if (customActiveFlow === CreatePostFlow.CreateAnnouncement) {
      const currentDate = new Date().toISOString();
      const newAnnouncement = isRegularPost(data, currentDate, isAdmin);
      if (newAnnouncement) {
        setAnnouncement({
          label: '1 week',
          value: afterXUnit(1, 'weeks').toISOString().substring(0, 19) + 'Z',
        });
      } else {
        setAnnouncement({
          label: 'Custom Date',
          value: data?.announcement?.end || '',
        });
      }
      setActiveFlow(CreatePostFlow.CreateAnnouncement);
    }
  }, [customActiveFlow]);

  useEffect(() => {
    if (data) {
      if (data.isAnnouncement) {
        setAnnouncement({ label: 'Custom Date', value: data.announcement.end });
      }
      if (data?.schedule) {
        setSchedule({
          timezone: data.schedule.timeZone,
          date: data.schedule.dateTime,
          time: `${moment(new Date(data.schedule.dateTime)).format('h:mm a')}`,
        });
      }
      if (data?.pollContext) {
        setPoll({
          question: data.pollContext.question,
          options: data.pollContext.options,
          closedAt: data.pollContext.closedAt,
        });
      }
      if (data?.shoutoutRecipients?.length) {
        const transformedObject: any = {};
        data?.shoutoutRecipients.forEach((item: any) => {
          transformedObject[item.userId] = {
            userId: item.userId,
            email: item.email,
            fullName: item.fullName,
            status: item.status,
            workLocation: item.workLocation,
            designation: item.designation,
            department: item.department,
            profileImage: item.profileImage,
          };
        });
        setShoutoutUsers(transformedObject);
        const recipientIds = data.shoutoutRecipients.map(
          (recipient) => recipient.userId,
        );
        setShoutoutUserIds(recipientIds);
      }
    }
  }, []);

  const createPostMutation = useMutation({
    mutationKey: ['createPostMutation'],
    mutationFn: createPost,
    onError: () => {
      clearPostContext();
      closeModal();
      failureToastConfig({
        content: `Error while trying to create post`,
        dataTestId: 'comment-toaster',
      });
    },
    onSuccess: async ({
      result,
    }: {
      code: number;
      message: string;
      result: { data: IPost };
    }) => {
      const newPost: IPost = result?.data;
      if (!!!newPost.schedule) {
        setFeed({ ...feed, [newPost.id!]: { ...newPost } });
        if (isAdmin) {
          // Update cached query data for admins
          if (newPost.isAnnouncement) {
            // push announcement to top of feed for admins
            queryClient.setQueriesData(
              {
                queryKey: ['feed'],
                exact: false,
              },
              (oldData: any) =>
                produce(oldData, (draft: any) => {
                  if (draft?.pages?.length) {
                    draft.pages[0].data.result.data = [
                      { id: newPost.id },
                      ...draft.pages[0].data.result.data,
                    ];
                  }
                }),
            );
            queryClient.setQueriesData(
              {
                queryKey: ['my-profile-feed'],
                exact: false,
              },
              (oldData: any) =>
                produce(oldData, (draft: any) => {
                  if (draft?.pages?.length) {
                    draft.pages[0].data.result.data = [
                      { id: newPost.id },
                      ...draft.pages[0].data.result.data,
                    ];
                  }
                }),
            );
          } else {
            // insert normal post to correct page or first page if first page is not full till limit, Skip insert if all posts are announcement
            queryClient.setQueriesData(
              {
                queryKey: ['feed'],
                exact: false,
              },
              (oldData: any) =>
                produce(oldData, (draft: any) => {
                  let pageIndex = 0;
                  while (draft?.pages && pageIndex < draft?.pages.length) {
                    const shouldInsert = draft.pages[
                      pageIndex
                    ].data.result.data.some(
                      ({ id }: { id: string }) =>
                        !feed[id].isAnnouncement ||
                        (draft?.pages.length === 1 &&
                          draft?.pages[0].length <
                            draft.pages[pageIndex].data.result.limit),
                    );
                    if (shouldInsert) {
                      draft.pages[pageIndex].data.result.data = [
                        { id: newPost.id },
                        ...draft.pages[pageIndex].data.result.data,
                      ];
                      break;
                    }
                    pageIndex += 1;
                  }
                }),
            );
            queryClient.setQueriesData(
              {
                queryKey: ['my-profile-feed'],
                exact: false,
              },
              (oldData: any) =>
                produce(oldData, (draft: any) => {
                  let pageIndex = 0;
                  while (draft?.pages && draft?.pages[pageIndex]) {
                    const shouldInsert = draft.pages[
                      pageIndex
                    ].data.result.data.some(
                      ({ id }: { id: string }) =>
                        !feed[id].isAnnouncement ||
                        (draft?.pages.length === 1 &&
                          draft?.pages[0].length <
                            draft.pages[pageIndex].data.result.limit),
                    );
                    if (shouldInsert) {
                      draft.pages[pageIndex].data.result.data = [
                        { id: newPost.id },
                        ...draft.pages[pageIndex].data.result.data,
                      ];
                      break;
                    }
                    pageIndex += 1;
                  }
                }),
            );
          }
        } else {
          /**
           * Update cached query data for members
           * Members can't create announcement so skipping check for `newPost` is announcement or not. Its normal post only.
           * Acknowleged announcement behave as normal post for members.
           * Insert normal post to correct page or first page if first page is not full till limit, Skip insert if posts are announcement and not acknowledged.
           */
          queryClient.setQueriesData(
            {
              queryKey: ['feed'],
              exact: false,
            },
            (oldData: any) =>
              produce(oldData, (draft: any) => {
                let pageIndex = 0;
                while (draft?.pages && draft?.pages[pageIndex]) {
                  const shouldInsert = draft.pages[
                    pageIndex
                  ].data.result.data.some(
                    ({ id }: { id: string }) =>
                      !feed[id].isAnnouncement ||
                      (feed[id].isAnnouncement && feed[id].acknowledged) ||
                      (draft?.pages.length === 1 &&
                        draft?.pages[0].length <
                          draft.pages[pageIndex].data.result.limit),
                  );
                  if (shouldInsert) {
                    draft.pages[pageIndex].data.result.data = [
                      { id: newPost.id },
                      ...draft.pages[pageIndex].data.result.data,
                    ];
                    break;
                  }
                  pageIndex += 1;
                }
              }),
          );
          queryClient.setQueriesData(
            {
              queryKey: ['my-profile-feed'],
              exact: false,
            },
            (oldData: any) =>
              produce(oldData, (draft: any) => {
                let pageIndex = 0;
                while (draft?.pages && draft?.pages[pageIndex]) {
                  const shouldInsert = draft.pages[
                    pageIndex
                  ].data.result.data.some(
                    ({ id }: { id: string }) =>
                      !feed[id].isAnnouncement ||
                      (feed[id].isAnnouncement && feed[id].acknowledged) ||
                      (draft?.pages.length === 1 &&
                        draft?.pages[0].length <
                          draft.pages[pageIndex].data.result.limit),
                  );
                  if (shouldInsert) {
                    draft.pages[pageIndex].data.result.data = [
                      { id: newPost.id },
                      ...draft.pages[pageIndex].data.result.data,
                    ];
                    break;
                  }
                  pageIndex += 1;
                }
              }),
          );
        }
      }
      clearPostContext();
      closeModal();
      if (newPost.schedule) {
        successToastConfig({
          content: `Post scheduled for ${moment(
            new Date(newPost.schedule.dateTime),
          ).format('ddd, MMM DD')} at ${moment(
            new Date(newPost.schedule.dateTime),
          ).format('hh:mm a')}`,
          dataTestId: 'toast-post-scheduled',
        });
        await queryClient.invalidateQueries(['scheduledPosts'], {
          exact: false,
        });
      }
      if (activeFeedPostCount === 0)
        await queryClient.invalidateQueries(['feed']);
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
          shoutoutRecipients: data?.shoutoutRecipients,
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
      failureToastConfig({
        content: 'Error updating post',
        dataTestId: 'post-update-toaster',
      });
    },
    onSuccess: async (data, variables) => {
      updateFeed(variables.id!, {
        ...data.result.data,
        ...(data?.result?.data?.isAnnouncement &&
          !isAdmin && { acknowledged: true }),
        id: variables.id!,
      } as IPost);
      successToastConfig({
        content: 'Post updated successfully',
        dataTestId: 'post-update-toaster',
      });
      await queryClient.invalidateQueries(['feed-announcements-widget']);
      await queryClient.invalidateQueries(['post-announcements-widget']);
    },
  });

  const handleSubmitPost = async (content?: IEditorValue, files?: File[]) => {
    let fileIds: string[] = [];
    let uploadedMedia: IMedia[] = [];
    const mentionList: IMention[] = [];
    const hashtagList: string[] = [];
    const mapUsersToAudience = (users: any[]) =>
      users?.map((user) => ({
        entityId: user.userId ?? user.id,
        entityType: AudienceEntityType.User,
        name: user.fullName,
      }));
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

    quillHashtagConversion(content?.editor)?.ops?.forEach(
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
      const _shoutoutUsers = Object.values(shoutoutUsers).filter(Boolean);

      const shoutoutAudience =
        _shoutoutUsers?.length > 0 ? mapUsersToAudience(_shoutoutUsers) : [];

      const finalAudience =
        audience && audience.length > 0
          ? [...audience, ...shoutoutAudience]
          : [];
      createPostMutation.mutate({
        content: removeEmptyLines({
          text: content?.text || editorValue.text,
          html: content?.html || editorValue.html,
          editor: content?.editor || editorValue.editor,
        }),
        type: postType || PostType.Update,
        files: fileIds,
        mentions: mentionList || [],
        hashtags: hashtagList || [],
        audience: finalAudience,
        shoutoutRecipients: shoutoutUserIds || [],
        isAnnouncement: !!announcement,
        announcement: {
          end: announcement?.value || '',
        },
        pollContext: poll
          ? {
              question: poll?.question,
              options: poll?.options,
              closedAt: poll?.closedAt,
            }
          : undefined,
        link: previewUrl && previewUrl[0],
        schedule: schedule
          ? {
              timeZone: schedule?.timezone || '',
              dateTime: schedule?.date || '',
            }
          : null,
      });
    } else if (PostBuilderMode.Edit) {
      const _shoutoutUsers = Object.values(shoutoutUsers).filter(Boolean);
      const shoutoutAudience =
        _shoutoutUsers?.length > 0 ? mapUsersToAudience(_shoutoutUsers) : [];

      const finalAudience =
        audience && audience.length > 0
          ? [...audience, ...shoutoutAudience]
          : [];

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
        content: removeEmptyLines({
          text: content?.text || editorValue.text,
          html: content?.html || editorValue.html,
          editor: content?.editor || editorValue.editor,
        }),
        type: postType || PostType.Update,
        files: sortedIds,
        mentions: mentionList || [],
        hashtags: hashtagList || [],
        audience: finalAudience,
        shoutoutRecipients: shoutoutUserIds || [],
        isAnnouncement: !!announcement,
        announcement: {
          end: announcement?.value || '',
        },
        id: data?.id,
        link: previewUrl && previewUrl[0],
        pollContext: poll
          ? {
              question: poll?.question,
              options: poll?.options,
              closedAt: poll?.closedAt,
            }
          : undefined,
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

  const handleOnClose = () => {
    closeModal();
    clearPostContext();
  };

  return (
    <>
      <Modal
        open={open}
        closeModal={
          mode === PostBuilderMode.Create && !isEmpty
            ? showConfirm
            : handleOnClose
        }
        dataTestId={
          activeFlow === CreatePostFlow.SchedulePost
            ? 'createpost-scheduledpost-modal'
            : ''
        }
        className="max-w-[638px]"
      >
        {activeFlow === CreatePostFlow.CreatePost && (
          <CreatePost
            data={data}
            closeModal={() => {
              if (loading) {
                return null;
              }
              hideEmojiPalette();
              return mode === PostBuilderMode.Create && !isEmpty
                ? showConfirm()
                : handleOnClose();
            }}
            handleSubmitPost={handleSubmitPost}
            isLoading={loading}
            dataTestId="feed-createpost"
            mode={mode}
          />
        )}
        {activeFlow === CreatePostFlow.CreateAnnouncement && (
          <CreateAnnouncement
            closeModal={
              mode === PostBuilderMode.Create ? showConfirm : handleOnClose
            }
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
            closeModal={
              mode === PostBuilderMode.Create ? showConfirm : handleOnClose
            }
          />
        )}
        {activeFlow === CreatePostFlow.CreatePoll && (
          <div data-testid="createpost-createpoll-modal">
            <CreatePoll
              closeModal={
                mode === PostBuilderMode.Create && !isEmpty
                  ? showConfirm
                  : handleOnClose
              }
            />
          </div>
        )}
        {activeFlow === CreatePostFlow.CreateShoutout && (
          <CreateShoutout
            closeModal={
              mode === PostBuilderMode.Create && !isEmpty
                ? showConfirm
                : handleOnClose
            }
          />
        )}
        {activeFlow === CreatePostFlow.SchedulePost && (
          <SchedulePost
            closeModal={
              mode === PostBuilderMode.Create && !isEmpty
                ? showConfirm
                : handleOnClose
            }
          />
        )}
        {activeFlow === CreatePostFlow.Audience && (
          <Audience
            closeModal={
              mode === PostBuilderMode.Create && !isEmpty
                ? showConfirm
                : handleOnClose
            }
            dataTestId="audience-selection"
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
            color={'text-white'}
            onClick={() => setShowFullscreenVideo(false)}
          />
        </Modal>
      )}
      <ConfirmationBox
        open={confirm}
        onClose={closeConfirm}
        title="Discard"
        description={
          <span>
            Are you sure you want to discard this post? This cannot be undone
          </span>
        }
        success={{
          label: 'Discard',
          className: 'bg-red-500 text-white ',
          onSubmit: handleOnClose,
        }}
        discard={{
          label: 'Cancel',
          className: 'text-neutral-900 bg-white ',
          onCancel: closeConfirm,
        }}
      />
    </>
  );
};

export default CreatePostModal;
