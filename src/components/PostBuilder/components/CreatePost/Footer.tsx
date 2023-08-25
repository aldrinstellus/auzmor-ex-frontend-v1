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
import React, { useContext, useMemo } from 'react';
import ReactQuill from 'react-quill';
import { convert } from 'html-to-text';
import { operatorXOR, twConfig } from 'utils/misc';
import { PostBuilderMode } from 'components/PostBuilder';

export interface IFooterProps {
  isLoading: boolean;
  quillRef: React.RefObject<ReactQuill>;
  handleSubmitPost: (content: IEditorValue, files: File[]) => void;
  mode: PostBuilderMode;
}

const Footer: React.FC<IFooterProps> = ({
  isLoading,
  quillRef,
  handleSubmitPost,
  mode,
}) => {
  const { isMember } = useRole();
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
    !!(postType && postType !== POST_TYPE.Media) ||
    mode === PostBuilderMode.Edit;
  const isShoutoutDisabled =
    operatorXOR(isPreviewRemoved, !!previewUrl) ||
    (postType && postType !== POST_TYPE.Shoutout) ||
    mode === PostBuilderMode.Edit;
  const isPollDisabled =
    (postType && postType !== POST_TYPE.Poll) || mode === PostBuilderMode.Edit;

  const postMenuItems = useMemo(
    () => [
      {
        id: 1,
        label: 'Media',
        icon: (
          <Icon
            name="imageFilled"
            color={isMediaDisabled ? 'text-neutral-200' : 'text-black'}
            size={14}
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
            iconClassName: 'p-2 rounded-7xl border mr-2.5 bg-white',
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
            iconClassName: 'p-2 rounded-7xl border mr-2.5 bg-white',
            dataTestId: 'feed-createpost-uploadvideo-menuitem',
          },
          {
            label: 'Share a document',
            icon: 'document',
            iconClassName: 'p-2 rounded-7xl border mr-2.5 bg-white',
            disabled: true,
          },
        ],
        divider: <Divider variant={DividerVariant.Vertical} />,
      },
      {
        id: 2,
        label: 'Shoutout',
        icon: (
          <Icon
            name="magicStarFilled"
            size={14}
            color={isShoutoutDisabled ? 'text-neutral-200' : 'text-black'}
            dataTestId="feed-createpost-shoutout"
          />
        ),
        menuItems: [],
        divider: <Divider variant={DividerVariant.Vertical} />,
        disabled: isShoutoutDisabled,
        onClick: () => {
          updateContext();
          setActiveFlow(CreatePostFlow.CreateShoutout);
        },
      },
      {
        id: 3,
        label: 'Events',
        icon: (
          <Icon
            name="calendarFilledTwo"
            size={14}
            dataTestId="feed-createpost-events"
            color="text-neutral-200"
          />
        ),
        menuItems: [],
        divider: <Divider variant={DividerVariant.Vertical} />,
        disabled: true,
      },
      {
        id: 4,
        label: 'Polls',
        icon: (
          <Icon
            name="chartFilled"
            size={14}
            dataTestId="feed-createpost-polls"
            color={isPollDisabled ? 'text-neutral-200' : 'text-black'}
          />
        ),
        menuItems: [],
        hidden: false,
        disabled: isPollDisabled,
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
            color="text-black"
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
            iconClassName: 'p-2 rounded-7xl border mr-2.5 bg-white',
            dataTestId: 'feed-createpost-shareasannouncement',
          },
          {
            label: 'Save as drafts',
            icon: 'draft',
            iconClassName: 'p-2 rounded-7xl border mr-2.5 bg-white',
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
    <div className="flex justify-between items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
      <div className="flex relative">
        {postMenuItems.map(
          (postMenuItem) =>
            !postMenuItem.hidden && (
              <div
                key={postMenuItem.id}
                className="flex mr-4 items-center"
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
                      >
                        {postMenuItem.icon}
                      </div>
                    ) : (
                      <Tooltip
                        tooltipContent={postMenuItem.label}
                        className="cursor-pointer"
                      >
                        {postMenuItem.label !== 'More' ? (
                          <div className="flex justify-center items-center w-8 h-8 bg-white border border-neutral-200 rounded-7xl">
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
        <Divider variant={DividerVariant.Vertical} className="!h-8" />
      </div>
      <div className="flex items-center">
        <div className="mr-4">
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
        <Button
          label={schedule ? 'Schedule' : 'Post'}
          disabled={isLoading || isCharLimit || !!mediaValidationErrors?.length}
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
