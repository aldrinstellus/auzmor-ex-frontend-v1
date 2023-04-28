import React, { memo, useRef, useState } from 'react';
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
const Delta = Quill.import('delta');

export interface EditorContentChanged {
  text: string;
  html: string;
  json: DeltaStatic;
}

export type QuillEditorProps = {
  className?: string;
  placeholder: string;
  charLimit?: number;
  onChangeEditor?: (content: EditorContentChanged) => void;
};

const RichTextEditor: React.FC<QuillEditorProps> = ({
  className,
  placeholder,
  charLimit = 3000,
  onChangeEditor,
}) => {
  const reactQuillRef = useRef<ReactQuill>(null);
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
      reactQuillRef.current?.editor?.deleteText(
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
  };

  return (
    <>
      <ReactQuill
        id="quill"
        className={className}
        modules={{ ...modules }}
        placeholder={placeholder}
        theme="snow"
        ref={reactQuillRef}
        formats={formats}
        onChange={onChangeEditorContent}
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
      <Toolbar isCharLimit={isCharLimit} />
    </>
  );
};

export default memo(RichTextEditor);
