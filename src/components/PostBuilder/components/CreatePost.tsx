import React, { useContext, useRef } from 'react';
import RichTextEditor from 'components/RichTextEditor';
import Actor from 'components/Actor';
import { CREATE_POST } from 'components/Actor/constant';
import Icon from 'components/Icon';
import { twConfig } from 'utils/misc';
import IconButton, { Variant as IconVariant } from 'components/IconButton';
import PopupMenu from 'components/PopupMenu';
import Tooltip from 'components/Tooltip';
import Divider, { Variant as DividerVariant } from 'components/Divider';
import Button from 'components/Button';
import { postTypeMapIcons } from 'pages/Feed';
import { CreatePostContext, IEditorValue } from 'contexts/CreatePostContext';
import { CreatePostFlow } from 'contexts/CreatePostContext';
import ReactQuill from 'react-quill';
import { DeltaStatic } from 'quill';

interface ICreatePostProps {
  closeModal: () => void;
  handleSubmitPost: (content: IEditorValue) => void;
}

const CreatePost: React.FC<ICreatePostProps> = ({
  closeModal,
  handleSubmitPost,
}) => {
  const quillRef = useRef<ReactQuill>(null);
  const { setActiveFlow, setEditorValue, editorValue } =
    useContext(CreatePostContext);
  const Header: React.FC = () => (
    <div className="flex flex-wrap border-b-1 border-neutral-200 items-center">
      <div className="text-lg text-black p-4 font-extrabold flex-[50%]">
        Create a post
      </div>
      <IconButton
        onClick={() => {
          closeModal && closeModal();
        }}
        icon={'close'}
        className="!flex-[0] !text-right !p-1 !mx-4 !my-3 !bg-inherit !text-neutral-900"
        variant={IconVariant.Primary}
      />
    </div>
  );
  const Body: React.FC = () => (
    <div className="text-sm text-neutral-900">
      <div className="max-h-[75vh] overflow-y-auto">
        <Actor visibility="Everyone" contentMode={CREATE_POST} />
        <RichTextEditor
          placeholder="What’s on your mind?"
          className="max-h-64 overflow-y-auto min-h-[128px]"
          defaultValue={editorValue.json as DeltaStatic}
          ref={quillRef}
        />
      </div>
    </div>
  );
  const Footer: React.FC = () => (
    <div className="flex justify-between items-center h-16 p-6 bg-blue-50">
      <div className="flex relative">
        {postTypeMapIcons.map((type) => (
          <PopupMenu
            triggerNode={
              <div className="mr-4">
                <Tooltip tooltipContent={type.label}>
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
        <div></div>
        <Button
          label={'Post'}
          onClick={() =>
            handleSubmitPost({
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
            })
          }
        />
      </div>
    </div>
  );
  return (
    <>
      <Header />
      <Body />
      <Footer />
    </>
  );
};

export default CreatePost;
