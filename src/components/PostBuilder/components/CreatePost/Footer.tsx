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
import { DeltaStatic } from 'quill';
import React, { ForwardedRef, useContext, useMemo } from 'react';
import ReactQuill from 'react-quill';

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
  const { setActiveFlow, setEditorValue, inputImgRef, inputVideoRef, files } =
    useContext(CreatePostContext);
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
  const postMenuItems = useMemo(
    () => [
      {
        id: 1,
        label: 'Media',
        icon: <Icon name="imageFilled" fill="#000000" size={14} />,
        menuItems: [
          {
            label: 'Upload a photo',
            icon: 'image',
            onClick: () => {
              updateContext();
              inputImgRef?.current && inputImgRef?.current?.click();
            },
            iconClassName: 'p-2 rounded-7xl border mr-2.5 bg-white',
          },
          {
            label: 'Upload a video',
            icon: 'video',
            onClick: () => {
              updateContext();
              inputVideoRef?.current && inputVideoRef?.current?.click();
            },
            iconClassName: 'p-2 rounded-7xl border mr-2.5 bg-white',
          },
          {
            label: 'Share a document',
            icon: 'document',
            iconClassName: 'p-2 rounded-7xl border mr-2.5 bg-white',
          },
        ],
        divider: <Divider variant={DividerVariant.Vertical} />,
      },
      {
        id: 2,
        label: 'Shoutout',
        icon: <Icon name="magicStarFilled" fill="#000000" size={14} />,
        menuItems: [],
        divider: <Divider variant={DividerVariant.Vertical} />,
      },
      {
        id: 3,
        label: 'Events',
        icon: <Icon name="calendarFilledTwo" fill="#000000" size={14} />,
        menuItems: [],
        divider: <Divider variant={DividerVariant.Vertical} />,
      },
      {
        id: 4,
        label: 'Polls',
        icon: <Icon name="chartFilled" fill="#000000" size={14} />,
        menuItems: [],
      },
      {
        id: 5,
        label: 'More',
        icon: <Icon name="moreOutline" stroke="#000000" />,
        menuItems: [
          {
            label: 'Share as an announcement',
            icon: 'speaker',
            onClick: () => {
              updateContext();
              setActiveFlow(CreatePostFlow.CreateAnnouncement);
            },
            iconClassName: 'p-2 rounded-7xl border mr-2.5 bg-white',
          },
          {
            label: 'Save as drafts',
            icon: 'draft',
            iconClassName: 'p-2 rounded-7xl border mr-2.5 bg-white',
          },
        ],
      },
    ],
    [],
  );
  return (
    <div className="flex justify-between items-center h-16 p-6 bg-blue-50">
      <div className="flex relative">
        {postMenuItems.map((postMenuItem) => (
          <PopupMenu
            triggerNode={
              <div className="mr-4">
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
              </div>
            }
            menuItems={postMenuItem.menuItems}
            key={postMenuItem.id}
          />
        ))}
        <Divider variant={DividerVariant.Vertical} className="!h-8" />
      </div>
      <div className="flex items-center">
        <Button
          label="Post"
          className="w-24"
          disabled={isLoading}
          onClick={() => {
            updateContext();
            handleSubmitPost(
              {
                text:
                  quillRef.current
                    ?.makeUnprivilegedEditor(quillRef.current?.getEditor())
                    .getText() || '',
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
        />
      </div>
    </div>
  );
};

Footer.displayName = 'Footer';

export default Footer;
