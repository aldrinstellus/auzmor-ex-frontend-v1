import React, { LegacyRef, memo, useContext, useState } from 'react';
import ReactQuill, { Quill, UnprivilegedEditor } from 'react-quill';
import { DeltaStatic, Sources } from 'quill';
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
import './mentions/quill.mention';
import './mentions/quill.mention.css';

import { MentionBlot } from './mentions/blots/mentions';
import Toolbar from './toolbar/index';
import { LinkBlot } from './blots/link';
import AutoLinks from './autoLinks';
import EmojiBlot from './blots/emoji';
import EmojiToolbar from './emoji';
import { mention } from './config';
import Icon from 'components/Icon';
import { twConfig } from 'utils/misc';
import { CreatePostContext, CreatePostFlow } from 'contexts/CreatePostContext';
import moment from 'moment';

export interface IEditorContentChanged {
  text: string;
  html: string;
  json: DeltaStatic;
}

export interface IQuillEditorProps {
  className?: string;
  placeholder: string;
  charLimit?: number;
  defaultValue?: ReactQuill.Value;
  onChangeEditor?: (content: IEditorContentChanged) => void;
}

const RichTextEditor = React.forwardRef(
  (
    {
      className,
      placeholder,
      charLimit = 3000,
      defaultValue,
      onChangeEditor,
    }: IQuillEditorProps,
    ref,
  ) => {
    const { announcement, setActiveFlow, setEditorValue } =
      useContext(CreatePostContext);
    const [isCharLimit, setIsCharLimit] = useState<boolean>(false);

    const formats = ['bold', 'italic', 'underline', 'mention', 'link', 'emoji'];

    const modules = {
      toolbar: {
        container: '#toolbar',
      },
      mention: mention,
      autoLinks: true,
      'emoji-toolbar': true,
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
        console.log('limit reached');
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
    };

    return (
      <>
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
        {/* <MediaPreview
        media={[
          {
            type: 'image',
            url: 'https://cdn.pixabay.com/photo/2012/08/27/14/19/mountains-55067_1280.png',
          },
        ]}
        className="m-6"
      /> */}
        {announcement && (
          <div className="flex justify-between bg-primary-100 px-4 py-2 m-4">
            <div className="flex items-center">
              <Icon
                name="calendarOutlineTwo"
                size={16}
                stroke={twConfig.theme.colors.neutral['900']}
              />
              <div className="ml-2.5">
                Post will be scheduled for{' '}
                {moment(new Date(announcement.value)).format(
                  'ddd, MMM DD [at] h:mm a',
                )}
              </div>
            </div>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => {
                setEditorValue({
                  text: (ref as any).current
                    ?.makeUnprivilegedEditor((ref as any).current?.getEditor())
                    .getText(),
                  html: (ref as any).current
                    ?.makeUnprivilegedEditor((ref as any).current?.getEditor())
                    .getHTML(),
                  json: (ref as any).current
                    ?.makeUnprivilegedEditor((ref as any).current?.getEditor())
                    .getContents(),
                });
                setActiveFlow(CreatePostFlow.CreateAnnouncement);
              }}
            >
              <Icon
                name="editOutline"
                size={12}
                stroke={twConfig.theme.colors.neutral['900']}
              />
              <div className="ml-1 text-xs font-bold text-neutral-900">
                Edit
              </div>
            </div>
          </div>
        )}

        <Toolbar isCharLimit={isCharLimit} />
      </>
    );
  },
);

RichTextEditor.displayName = 'RichTextEditor';

export default memo(RichTextEditor);
