import React, { useContext, useRef } from 'react';
import RichTextEditor from 'components/RichTextEditor';
import Actor from 'components/Actor';
import { CREATE_POST } from 'components/Actor/constant';
import Icon from 'components/Icon';
import { getMediaObj, twConfig } from 'utils/misc';
import IconButton, { Variant as IconVariant } from 'components/IconButton';
import PopupMenu from 'components/PopupMenu';
import Tooltip from 'components/Tooltip';
import Divider, {
  Variant as DividerVariant,
  Variant,
} from 'components/Divider';
import Button from 'components/Button';
import { CreatePostContext, IEditorValue } from 'contexts/CreatePostContext';
import { CreatePostFlow } from 'contexts/CreatePostContext';
import ReactQuill from 'react-quill';
import { DeltaStatic } from 'quill';
import Toolbar from 'components/RichTextEditor/toolbar';
import PreviewLink from 'components/PreviewLink';
import { IPost } from 'queries/post';
import { IPostTypeIcon } from 'pages/Feed';
import Spinner from 'components/Spinner';
interface ICreatePostProps {
  closeModal: () => void;
  handleSubmitPost: (content: IEditorValue, files: File[]) => void;
  data?: IPost;
  isLoading?: boolean;
}

const CreatePost: React.FC<ICreatePostProps> = ({
  data,
  closeModal,
  handleSubmitPost,
  isLoading = false,
}) => {
  const quillRef = useRef<ReactQuill>(null);
  const {
    setActiveFlow,
    setEditorValue,
    editorValue,
    setAnnouncement,
    inputImgRef,
    inputVideoRef,
    setUploads,
    files,
  } = useContext(CreatePostContext);

  const Header: React.FC = () => (
    <div className="flex flex-wrap border-b-1 border-neutral-200 items-center">
      <div className="text-lg text-black p-4 font-extrabold flex-[50%]">
        Create a post
      </div>
      {!isLoading && (
        <IconButton
          onClick={() => {
            closeModal && closeModal();
            setAnnouncement({});
          }}
          icon={'close'}
          className="!flex-[0] !text-right !p-1 !mx-4 !my-3 !bg-inherit !text-neutral-900"
          variant={IconVariant.Primary}
        />
      )}
    </div>
  );
  const Body: React.FC = () => (
    <div className="text-sm text-neutral-900">
      <div className="max-h-[75vh] overflow-y-auto">
        <Actor visibility="Everyone" contentMode={CREATE_POST} />
        <RichTextEditor
          placeholder="What’s on your mind?"
          className="max-h-64 overflow-y-auto min-h-[128px]"
          defaultValue={
            data?.content?.editor || (editorValue.json as DeltaStatic)
          }
          ref={quillRef}
          renderToolbar={(isCharLimit: boolean) => (
            <Toolbar isCharLimit={isCharLimit} />
          )}
          renderPreviewLink={(
            previewUrl: string,
            setPreviewUrl: (previewUrl: string) => void,
            setIsPreviewRemove: (isPreviewRemove: boolean) => void,
          ) => (
            <PreviewLink
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
              setIsPreviewRemove={setIsPreviewRemove}
            />
          )}
        />
      </div>
    </div>
  );
  const postTypeMapIcons: IPostTypeIcon[] = [
    {
      id: 1,
      label: 'Media',
      icon: <Icon name="imageFilled" fill="#000000" size={14} />,
      menuItems: [
        {
          renderNode: (
            <div
              className="flex px-6 py-3 items-center hover:bg-primary-50"
              onClick={() => {
                updateContext();
                inputImgRef?.current && inputImgRef?.current?.click();
              }}
            >
              <Icon
                name="image"
                size={16}
                className="p-2 rounded-7xl border mr-2.5 bg-white"
                fill={twConfig.theme.colors.primary['500']}
              />
              <div className="text-sm text-neutral-900 font-medium">
                Upload a photo
              </div>
            </div>
          ),
        },
        {
          renderNode: (
            <div
              className="flex px-6 py-3 items-center hover:bg-primary-50"
              onClick={() => {
                updateContext();
                inputVideoRef?.current && inputVideoRef?.current?.click();
              }}
            >
              <Icon
                name="video"
                size={16}
                className="p-2 rounded-7xl border mr-2.5 bg-white"
                fill={twConfig.theme.colors.primary['500']}
              />
              <div className="text-sm text-neutral-900 font-medium">
                Upload a video
              </div>
            </div>
          ),
        },
        {
          renderNode: (
            <div className="flex px-6 py-3 items-center hover:bg-primary-50">
              <Icon
                name="document"
                size={16}
                className="p-2 rounded-7xl border mr-2.5 bg-white"
                fill={twConfig.theme.colors.primary['500']}
              />
              <div className="text-sm text-neutral-900 font-medium">
                Share a document
              </div>
            </div>
          ),
        },
      ],
      divider: <Divider variant={Variant.Vertical} />,
    },
    {
      id: 2,
      label: 'Shoutout',
      icon: <Icon name="magicStarFilled" fill="#000000" size={14} />,
      menuItems: [],
      divider: <Divider variant={Variant.Vertical} />,
    },
    {
      id: 3,
      label: 'Events',
      icon: <Icon name="calendarFilledTwo" fill="#000000" size={14} />,
      menuItems: [],
      divider: <Divider variant={Variant.Vertical} />,
    },
    {
      id: 4,
      label: 'Polls',
      icon: <Icon name="chartFilled" fill="#000000" size={14} />,
      menuItems: [],
    },
  ];

  const updateContext = () => {
    setEditorValue({
      text: quillRef.current
        ?.makeUnprivilegedEditor(quillRef.current?.getEditor())
        .getText(),
      html: quillRef.current
        ?.makeUnprivilegedEditor(quillRef.current?.getEditor())
        .getHTML(),
      json: quillRef.current
        ?.makeUnprivilegedEditor(quillRef.current?.getEditor())
        .getContents(),
    });
  };
  return (
    <>
      <Header />
      <Body />
      <div className="flex justify-between items-center h-16 p-6 bg-blue-50">
        <div className="flex relative">
          {postTypeMapIcons.map((type) => (
            <PopupMenu
              triggerNode={
                <div className="mr-4">
                  <Tooltip
                    tooltipContent={type.label}
                    className="cursor-pointer"
                  >
                    <div className="flex justify-center items-center w-8 h-8 bg-white border border-neutral-200 rounded-7xl">
                      {type.icon}
                    </div>
                  </Tooltip>
                </div>
              }
              menuItems={type.menuItems}
              key={type.id}
            />
          ))}
          <PopupMenu
            triggerNode={
              <div className="flex justify-center items-center w-8 h-8 mr-2">
                <Icon name="moreOutline" stroke="#000000" />
              </div>
            }
            menuItems={[
              {
                renderNode: (
                  <div
                    className="flex px-6 py-3 items-center hover:bg-primary-50"
                    onClick={() => {
                      updateContext();
                      setActiveFlow(CreatePostFlow.CreateAnnouncement);
                    }}
                  >
                    <Icon
                      name="speaker"
                      size={16}
                      className="p-2 rounded-7xl border mr-2.5 bg-white"
                      fill={twConfig.theme.colors.primary['500']}
                    />
                    <div className="text-sm text-neutral-900 font-medium whitespace-nowrap">
                      Share as an announcement
                    </div>
                  </div>
                ),
              },
              {
                renderNode: (
                  <div className="flex px-6 py-3 items-center hover:bg-primary-50">
                    <Icon
                      name="draft"
                      size={16}
                      className="p-2 rounded-7xl border mr-2.5 bg-white"
                      fill={twConfig.theme.colors.primary['500']}
                    />
                    <div className="text-sm text-neutral-900 font-medium whitespace-nowrap">
                      Save as drafts
                    </div>
                  </div>
                ),
              },
            ]}
          />

          <Divider variant={DividerVariant.Vertical} className="!h-8" />
        </div>
        <div className="flex items-center">
          <Button
            label={isLoading ? <Spinner color="#FFFFFF" /> : 'Post'}
            className="w-24"
            disabled={isLoading}
            onClick={() =>
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
              )
            }
          />
        </div>
      </div>
      <input
        type="file"
        className="hidden"
        ref={inputImgRef}
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.length) {
            setUploads(Array.prototype.slice.call(e.target.files));
          }
        }}
        multiple
      />
      <input
        type="file"
        className="hidden"
        ref={inputVideoRef}
        accept="video/*"
        onChange={(e) => {
          if (e.target.files?.length) {
            setUploads(Array.prototype.slice.call(e.target.files));
          }
        }}
        multiple
      />
    </>
  );
};

export default CreatePost;
