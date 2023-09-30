import {
  LegacyRef,
  ReactNode,
  forwardRef,
  memo,
  useContext,
  useEffect,
  useState,
} from 'react';
import ReactQuill, { Quill, UnprivilegedEditor } from 'react-quill';
import { DeltaStatic, Sources } from 'quill';
import moment from 'moment';

// styles
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
import './mentions/quill.mention';
import './mentions/quill.mention.css';
import './styles.css';

// blots
import { MentionBlot } from './mentions/blots/mentions';
import { LinkBlot } from './blots/link';
import EmojiBlot from './blots/emoji';
import AutoLinks from './autoLinks';
import EmojiToolbar from './emoji';

import { mention, previewLinkRegex } from './config';

// components
import Icon from 'components/Icon';
import MediaPreview, { Mode } from 'components/MediaPreview';

// context
import { CreatePostContext, CreatePostFlow } from 'contexts/CreatePostContext';

import { hasDatePassed } from 'utils/time';
import { hideMentionHashtagPalette } from 'utils/misc';

export interface IEditorContentChanged {
  text: string;
  html: string;
  json: DeltaStatic;
}

export interface IQuillEditorProps {
  toolbarId: string;
  className?: string;
  placeholder: string;
  charLimit?: number;
  defaultValue?: ReactQuill.Value;
  renderToolbar?: (isCharLimit: boolean) => ReactNode;
  renderPreviewLink?: (
    previewUrl: string,
    setPreviewUrl: (previewUrl: string) => void,
    setIsPreviewRemove: (isPreviewRemove: boolean) => void,
  ) => ReactNode;
  onChangeEditor?: (content: IEditorContentChanged) => void;
  dataTestId?: string;
}

const emojiButtonIcon = `<svg
width={24}
height={24}
viewBox="0 0 24 24"
xmlns="http://www.w3.org/2000/svg"
fill="none"
>
<path
  class="path-stroke"
  d="M8.99988 21.9997H14.9998C19.9997 21.9997 21.9997 19.9997 21.9997 14.9998V8.99988C21.9997 3.99997 19.9997 2 14.9998 2H8.99988C3.99997 2 2 3.99997 2 8.99988V14.9998C2 19.9997 3.99997 21.9997 8.99988 21.9997Z"
  stroke="#737373"
  strokeLinecap="round"
  strokeLinejoin="round"
/>
<path
  class="path-stroke"
  d="M15.5 9.74995C16.3284 9.74995 16.9999 9.07839 16.9999 8.24997C16.9999 7.42156 16.3284 6.75 15.5 6.75C14.6716 6.75 14 7.42156 14 8.24997C14 9.07839 14.6716 9.74995 15.5 9.74995Z"
  stroke="#737373"
  strokeMiterlimit="10"
  strokeLinecap="round"
  strokeLinejoin="round"
/>
<path
  class="path-stroke"
  d="M8.49997 9.74995C9.32839 9.74995 9.99995 9.07839 9.99995 8.24997C9.99995 7.42156 9.32839 6.75 8.49997 6.75C7.67156 6.75 7 7.42156 7 8.24997C7 9.07839 7.67156 9.74995 8.49997 9.74995Z"
  stroke="#737373"
  strokeMiterlimit="10"
  strokeLinecap="round"
  strokeLinejoin="round"
/>
<path
  class="path-stroke"
  d="M8.39998 13.3008H15.5999C16.0999 13.3008 16.4998 13.7008 16.4998 14.2008C16.4998 16.6907 14.4899 18.7007 11.9999 18.7007C9.50997 18.7007 7.5 16.6907 7.5 14.2008C7.5 13.7008 7.89999 13.3008 8.39998 13.3008Z"
  stroke="#737373"
  strokeMiterlimit="10"
  strokeLinecap="round"
  strokeLinejoin="round"
/>
</svg>`;

const RichTextEditor = forwardRef(
  (
    {
      toolbarId,
      className,
      placeholder,
      charLimit = 3000,
      defaultValue,
      renderToolbar = () => <div id="toolbar"></div>,
      renderPreviewLink,
      onChangeEditor,
      dataTestId,
    }: IQuillEditorProps,
    ref,
  ) => {
    const {
      announcement,
      setActiveFlow,
      setEditorValue,
      media,
      inputImgRef,
      removeAllMedia,
    } = useContext(CreatePostContext);

    const [isCharLimit, setIsCharLimit] = useState<boolean>(false);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [isPreviewRemoved, setIsPreviewRemoved] = useState<boolean>(false);

    const formats = ['bold', 'italic', 'underline', 'mention', 'link', 'emoji'];

    const modules = {
      toolbar: {
        container: `#${toolbarId}-toolbar`,
      },
      mention: mention,
      autoLinks: true,
      'emoji-toolbar': {
        buttonIcon: emojiButtonIcon,
      },
    };

    Quill.register(
      {
        'formats/mention': MentionBlot,
        'formats/link': LinkBlot,
        'formats/emoji': EmojiBlot,
        'modules/autoLinks': AutoLinks,
        'modules/emoji-toolbar': EmojiToolbar,
      },
      true,
    );

    const onChangeEditorContent = (
      content: string,
      delta: DeltaStatic,
      source: Sources,
      editor: UnprivilegedEditor,
    ) => {
      if (editor.getLength() > charLimit) {
        (ref as any)?.current?.editor?.deleteText(
          charLimit,
          editor.getLength() - charLimit,
        );
        setIsCharLimit(true);
      } else {
        setIsCharLimit(false);
      }
      if (onChangeEditor) {
        onChangeEditor({
          text: editor.getText(),
          html: editor.getHTML(),
          json: editor.getContents(),
        });
      }
      const matches = editor.getText().match(previewLinkRegex);
      if (matches) {
        setPreviewUrl(matches[0]);
      } else {
        setPreviewUrl('');
        setIsPreviewRemoved(false);
      }
    };

    const updateContext = () => {
      setEditorValue({
        text: (ref as any).current
          ?.makeUnprivilegedEditor((ref as any).current?.getEditor())
          .getText(),
        html: (ref as any).current
          ?.makeUnprivilegedEditor((ref as any).current?.getEditor())
          .getHTML(),
        editor: (ref as any).current
          ?.makeUnprivilegedEditor((ref as any).current?.getEditor())
          .getContents(),
      });
    };

    useEffect(() => () => hideMentionHashtagPalette(), []);

    return (
      <div
        className="w-full relative flex flex-wrap gap-2"
        data-testid={dataTestId}
      >
        <ReactQuill
          id="quill"
          className={className}
          modules={{ ...modules }}
          placeholder={placeholder}
          theme="snow"
          ref={ref as LegacyRef<ReactQuill>}
          formats={formats}
          onChange={onChangeEditorContent}
          defaultValue={defaultValue}
        />
        {media.length > 0 && (
          <MediaPreview
            media={media}
            className="m-6"
            mode={Mode.Edit}
            onAddButtonClick={() => inputImgRef?.current?.click()}
            onCloseButtonClick={removeAllMedia}
            onEditButtonClick={() => {
              updateContext();
              setActiveFlow(CreatePostFlow.EditMedia);
            }}
          />
        )}
        {announcement?.label && !hasDatePassed(announcement.value) && (
          <div className="flex justify-between bg-primary-100 px-4 py-2 m-4">
            <div className="flex items-center">
              <Icon
                name="calendarOutlineTwo"
                size={16}
                color="text-neutral-900"
              />
              <div className="ml-2.5">
                Announcement will expire on{' '}
                {moment(new Date(announcement.value)).format(
                  'ddd, MMM DD [at] h:mm a',
                )}
              </div>
            </div>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => {
                updateContext();
                setActiveFlow(CreatePostFlow.CreateAnnouncement);
              }}
            >
              <Icon name="editOutline" size={12} color="text-neutral-900" />
              <div className="ml-1 text-xs font-bold text-neutral-900">
                Edit
              </div>
            </div>
          </div>
        )}
        {!isPreviewRemoved &&
          renderPreviewLink &&
          renderPreviewLink(previewUrl, setPreviewUrl, setIsPreviewRemoved)}
        {renderToolbar && renderToolbar(isCharLimit)}
      </div>
    );
  },
);

RichTextEditor.displayName = 'RichTextEditor';

export default memo(RichTextEditor);
