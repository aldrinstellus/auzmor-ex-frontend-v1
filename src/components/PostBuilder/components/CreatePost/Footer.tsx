import Button from 'components/Button';
import Divider, { Variant as DividerVariant } from 'components/Divider';
import Icon from 'components/Icon';
import PopupMenu from 'components/PopupMenu';
import Tooltip from 'components/Tooltip';
import {
  CreatePostContext,
  CreatePostFlow,
  IEditorValue,
  POST_TYPE,
} from 'contexts/CreatePostContext';
import useRole from 'hooks/useRole';
import { DeltaStatic } from 'quill';
import { FC, RefObject, useContext, useMemo } from 'react';
import ReactQuill from 'react-quill';
import { convert } from 'html-to-text';
import { operatorXOR } from 'utils/misc';
import { PostBuilderMode } from 'components/PostBuilder';

export interface IFooterProps {
  isLoading: boolean;
  quillRef: RefObject<ReactQuill>;
  handleSubmitPost: (content: IEditorValue, files: File[]) => void;
  mode: PostBuilderMode;
}

const Footer: FC<IFooterProps> = ({
  isLoading,
  quillRef,
  handleSubmitPost,
  mode,
}) => {
  const {
    setActiveFlow,
    setEditorValue,
    inputImgRef,
    inputVideoRef,
    files,
    isCharLimit,
    mediaValidationErrors,
    isPreviewRemoved,
    previewUrl,
    schedule,
    postType,
  } = useContext(CreatePostContext);
  const { isMember } = useRole();
  const canSchedule = !(!!!schedule && mode === PostBuilderMode.Edit);

  const updateContext = () => {
    setEditorValue({
      text: quillRef
        .current!.makeUnprivilegedEditor(quillRef.current!.getEditor())
        .getText(),
      html: quillRef.current
        ?.makeUnprivilegedEditor(quillRef.current?.getEditor())
        .getHTML(),
      json: quillRef.current
        ?.makeUnprivilegedEditor(quillRef.current?.getEditor())
        .getContents(),
    });
  };

  const isMediaDisabled =
    operatorXOR(isPreviewRemoved, !!previewUrl) ||
    !!(postType && postType !== POST_TYPE.Media);
  const isShoutoutDisabled =
    operatorXOR(isPreviewRemoved, !!previewUrl) ||
    (!!postType && postType !== POST_TYPE.Shoutout);
  const isPollDisabled = !!postType && postType !== POST_TYPE.Poll;

  const postMenuItems = useMemo(
    () => [
      {
        id: 1,
        label: 'Media',
        icon: (
          <Icon
            name="imageFilled"
            color={isMediaDisabled ? 'text-neutral-200' : 'text-neutral-900'}
            size={14}
            disabled={isMediaDisabled}
            dataTestId="feed-createpost-media"
          />
        ),
        disabled: isMediaDisabled,
        menuItems: [
          {
            label: 'Upload a photo',
            icon: 'image',
            onClick: () => {
              updateContext();
              inputImgRef?.current && inputImgRef?.current?.click();
            },
            disabled: isMediaDisabled,
            iconWrapperClassName: 'p-2 rounded-7xl border mr-2.5 bg-white',
            dataTestId: 'feed-createpost-uploadphoto-menuitem',
          },
          {
            label: 'Upload a video',
            icon: 'video',
            onClick: () => {
              updateContext();
              inputVideoRef?.current && inputVideoRef?.current?.click();
            },
            disabled: isMediaDisabled,
            iconWrapperClassName: 'p-2 rounded-7xl border mr-2.5 bg-white',
            dataTestId: 'feed-createpost-uploadvideo-menuitem',
          },
          {
            label: 'Share a document',
            icon: 'document',
            disabled: true,
          },
        ],
        hidden: mode === PostBuilderMode.Edit,
        divider: <Divider variant={DividerVariant.Vertical} />,
      },
      {
        id: 2,
        label: 'Give kudos',
        icon: (
          <Icon
            name="magicStarFilled"
            size={14}
            color={isShoutoutDisabled ? 'text-neutral-200' : 'text-neutral-900'}
            disabled={isShoutoutDisabled}
            dataTestId="feed-createpost-shoutout"
          />
        ),
        menuItems: [],
        hidden: mode === PostBuilderMode.Edit,
        divider: <Divider variant={DividerVariant.Vertical} />,
        disabled: isShoutoutDisabled,
        onClick: () => {
          updateContext();
          setActiveFlow(CreatePostFlow.CreateShoutout);
        },
      },
      // {
      //   id: 3,
      //   label: 'Events',
      //   icon: (
      //     <Icon
      //       name="calendarFilledTwo"
      //       size={16}
      //       color={'text-neutral-900'}
      //       disabled
      //       dataTestId="feed-createpost-events"
      //     />
      //   ),
      //   menuItems: [],
      //   divider: <Divider variant={DividerVariant.Vertical} />,
      //   disabled: true,
      // },
      {
        id: 4,
        label: 'Polls',
        menuItems: [],
        dataTestId: 'createpost-poll',
        icon: (
          <Icon
            name="chartFilled"
            size={14}
            disabled={isPollDisabled}
            dataTestId="feed-createpost-polls"
            color={'text-neutral-900'}
          />
        ),
        disabled: isPollDisabled,
        hidden: mode === PostBuilderMode.Edit,
        onClick: () => {
          updateContext();
          setActiveFlow(CreatePostFlow.CreatePoll);
        },
      },
      {
        id: 5,
        label: 'More',
        icon: (
          <Icon
            name="moreOutline"
            color="stroke-[#292D32]"
            dataTestId="feed-createpost-ellipsis-icon"
          />
        ),
        hidden: isMember,
        menuItems: [
          {
            label: 'Share as an announcement',
            icon: 'speaker',
            onClick: () => {
              updateContext();
              setActiveFlow(CreatePostFlow.CreateAnnouncement);
            },
            disabled: isMember,
            iconWrapperClassName: 'p-2 rounded-7xl border mr-2.5 bg-white',
            dataTestId: 'feed-createpost-shareasannouncement',
          },
          {
            label: 'Save as drafts',
            icon: 'draft',
            disabled: true,
            dataTestId: 'feed-createpost-saveasdraft',
          },
        ],
      },
    ],
    [
      isPreviewRemoved,
      previewUrl,
      isMediaDisabled,
      isPollDisabled,
      isShoutoutDisabled,
    ],
  );

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-blue-50 rounded-b-9xl">
      <div className="flex relative gap-4">
        {postMenuItems
          .filter((menuItem) => !menuItem.hidden)
          .map(
            (postMenuItem) =>
              !postMenuItem.hidden && (
                <div
                  key={postMenuItem.id}
                  className="flex items-center"
                  onClick={() => {
                    if (!postMenuItem.disabled && postMenuItem.onClick) {
                      postMenuItem.onClick();
                    }
                  }}
                >
                  <PopupMenu
                    triggerNode={
                      postMenuItem?.disabled ? (
                        <div
                          className={`flex justify-center items-center w-8 h-8 bg-white border border-neutral-200 rounded-7xl ${
                            postMenuItem.disabled
                              ? 'cursor-not-allowed'
                              : 'cursor-default'
                          }`}
                          data-testid={postMenuItem?.dataTestId}
                        >
                          {postMenuItem.icon}
                        </div>
                      ) : (
                        <Tooltip
                          tooltipContent={postMenuItem.label}
                          className="cursor-pointer"
                        >
                          {postMenuItem.label !== 'More' ? (
                            <div
                              className="flex justify-center items-center w-8 h-8 bg-white border border-neutral-200 rounded-7xl"
                              data-testid={postMenuItem?.dataTestId}
                            >
                              {postMenuItem.icon}
                            </div>
                          ) : (
                            postMenuItem.icon
                          )}
                        </Tooltip>
                      )
                    }
                    menuItems={postMenuItem.menuItems}
                    className="bottom-full"
                  />
                </div>
              ),
          )}
        <Divider
          variant={DividerVariant.Vertical}
          className="!h-8 bg-neutral-200"
        />
      </div>
      <div className="flex items-center gap-3">
        {canSchedule && (
          <div>
            <Tooltip tooltipContent="Schedule" className="cursor-pointer">
              <Icon
                name="clockOutline"
                size={16}
                color="text-neutral-900"
                onClick={() => {
                  updateContext();
                  setActiveFlow(CreatePostFlow.SchedulePost);
                }}
                dataTestId="createpost-clock-icon"
              />
            </Tooltip>
          </div>
        )}
        <Button
          label={schedule ? 'Schedule' : 'Post'}
          disabled={isLoading || isCharLimit || !!mediaValidationErrors?.length}
          labelClassName="text-sm leadind-snug"
          onClick={() => {
            updateContext();
            handleSubmitPost(
              {
                text: convert(
                  quillRef.current
                    ?.makeUnprivilegedEditor(quillRef.current?.getEditor())
                    .getHTML() || '',
                  {
                    wordwrap: false, // by default it include all the tag
                  },
                ),
                html:
                  quillRef.current
                    ?.makeUnprivilegedEditor(quillRef.current?.getEditor())
                    .getHTML() || '',
                json: quillRef.current
                  ?.makeUnprivilegedEditor(quillRef.current?.getEditor())
                  .getContents() as DeltaStatic,
              },
              files,
            );
          }}
          dataTestId={
            schedule ? 'createpost-submit-scheduledpost' : 'feed-submitpost'
          }
          loading={isLoading}
        />
      </div>
    </div>
  );
};

Footer.displayName = 'Footer';

export default Footer;
