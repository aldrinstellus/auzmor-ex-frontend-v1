import Button from 'components/Button';
import Divider, { Variant as DividerVariant } from 'components/Divider';
import Icon from 'components/Icon';
import PopupMenu from 'components/PopupMenu';
import Tooltip from 'components/Tooltip';
import {
  CreatePostContext,
  CreatePostFlow,
  IEditorValue,
} from 'contexts/CreatePostContext';
import useRole from 'hooks/useRole';
import { DeltaStatic } from 'quill';
import { FC, RefObject, useContext, useMemo } from 'react';
import ReactQuill from 'react-quill';
import { convert } from 'html-to-text';
import { operatorXOR } from 'utils/misc';
import { PostBuilderMode } from 'components/PostBuilder';
import { PostType } from 'interfaces';
import { useTranslation } from 'react-i18next';

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
    isEmpty,
    media,
    shoutoutUserIds,
  } = useContext(CreatePostContext);
  const { t } = useTranslation('postBuilder');

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
      editor: quillRef.current
        ?.makeUnprivilegedEditor(quillRef.current?.getEditor())
        .getContents(),
    });
  };

  const isMediaDisabled =
    operatorXOR(isPreviewRemoved, !!previewUrl) || postType !== PostType.Update;
  const isShoutoutDisabled =
    operatorXOR(isPreviewRemoved, !!previewUrl) ||
    (postType !== PostType.Shoutout && postType !== PostType.Update) ||
    (media.length > 0 && shoutoutUserIds.length === 0);
  const isPollDisabled =
    operatorXOR(isPreviewRemoved, !!previewUrl) ||
    (postType !== PostType.Poll && postType !== PostType.Update) ||
    media.length != 0;

  const postMenuItems = useMemo(
    () => [
      {
        id: 1,
        label: t('postMenuItems.media'),
        icon: (
          <Icon
            name="imageFilled"
            color={isMediaDisabled ? 'text-neutral-200' : 'text-neutral-900'}
            size={14}
            disabled={isMediaDisabled}
            dataTestId="feed-createpost-media"
            tabIndex={isMediaDisabled ? -1 : 0}
          />
        ),
        disabled: isMediaDisabled,
        menuItems: [
          {
            label: t('postMenuItems.uploadPhoto'),
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
            label: t('postMenuItems.uploadVideo'),
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
            label: t('postMenuItems.shareDocument'),
            icon: 'document',
            disabled: true,
          },
        ],
        divider: <Divider variant={DividerVariant.Vertical} />,
      },
      {
        id: 2,
        label: t('postMenuItems.giveKudos'),
        icon: (
          <Icon
            name="magicStarFilled"
            size={14}
            color={isShoutoutDisabled ? 'text-neutral-200' : 'text-neutral-900'}
            disabled={isShoutoutDisabled}
            dataTestId="feed-createpost-shoutout"
            tabIndex={isShoutoutDisabled ? -1 : 0}
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
      {
        id: 3,
        label: t('postMenuItems.polls'),
        menuItems: [],
        dataTestId: 'createpost-poll',
        icon: (
          <Icon
            name="chartFilled"
            size={14}
            disabled={isPollDisabled}
            dataTestId="feed-createpost-polls"
            color={'text-neutral-900'}
            tabIndex={isPollDisabled ? -1 : 0}
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
        id: 4,
        label: t('postMenuItems.more'),
        icon: (
          <Icon
            name="moreOutline"
            color="stroke-[#292D32]"
            dataTestId="feed-createpost-ellipsis-icon"
            tabIndex={isMember ? -1 : 0}
          />
        ),
        hidden: isMember,
        menuItems: [
          {
            label: t('postMenuItems.shareAsAnnouncement'),
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
            label: t('postMenuItems.saveAsDraft'),
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
                tabIndex={0}
              />
            </Tooltip>
          </div>
        )}
        <Button
          label={schedule ? 'Schedule' : 'Post'}
          disabled={
            isLoading ||
            isCharLimit ||
            isEmpty ||
            !!mediaValidationErrors?.length
          }
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
                editor: quillRef.current
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
