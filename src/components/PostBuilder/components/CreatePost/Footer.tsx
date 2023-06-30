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
import React, { useContext, useMemo } from 'react';
import ReactQuill from 'react-quill';
import { convert } from 'html-to-text';
import { operatorXOR } from 'utils/misc';

export interface IFooterProps {
  isLoading: boolean;
  quillRef: React.RefObject<ReactQuill>;
  handleSubmitPost: (content: IEditorValue, files: File[]) => void;
}

const Footer: React.FC<IFooterProps> = ({
  isLoading,
  quillRef,
  handleSubmitPost,
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
    media,
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

  const isMediaDisabled = operatorXOR(isPreviewRemoved, !!previewUrl);
  const postMenuItems = useMemo(
    () => [
      {
        id: 1,
        label: 'Media',
        icon: isMediaDisabled ? (
          <Icon
            name="imageFilled"
            fill="#737373"
            size={14}
            dataTestId="feed-createpost-media"
          />
        ) : (
          <Icon
            name="imageFilled"
            fill="#000000"
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
            dataTestId="feed-createpost-shoutout"
          />
        ),
        menuItems: [],
        divider: <Divider variant={DividerVariant.Vertical} />,
        disabled: true,
      },
      {
        id: 3,
        label: 'Events',
        icon: (
          <Icon
            name="calendarFilledTwo"
            size={14}
            dataTestId="feed-createpost-events"
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
          />
        ),
        menuItems: [],
        disabled: true,
      },
      {
        id: 5,
        label: 'More',
        icon: (
          <Icon
            name="moreOutline"
            stroke="#000000"
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
    [isPreviewRemoved, previewUrl],
  );

  return (
    <div className="flex justify-between items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
      <div className="flex relative">
        {postMenuItems.map(
          (postMenuItem) =>
            !!!postMenuItem.hidden && (
              <div key={postMenuItem.id} className="flex mr-4 items-center">
                <PopupMenu
                  triggerNode={
                    postMenuItem?.disabled ? (
                      <div
                        className={`flex justify-center items-center w-8 h-8 bg-white border border-neutral-200 rounded-7xl ${
                          isPreviewRemoved || !!previewUrl
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
        <Button
          label="Post"
          className="w-24"
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
          dataTestId="feed-submitpost"
          loading={isLoading}
        />
      </div>
    </div>
  );
};

Footer.displayName = 'Footer';

export default Footer;
