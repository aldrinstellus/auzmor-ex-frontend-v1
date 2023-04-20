import React, { memo, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
import './mentions/quill.mention';
import './mentions/quill.mention.css';

import { MentionBlot } from './mentions/blots/mentions';
import Toolbar, { formats, modules } from './toolbar/index';
import { LinkBlot } from './blots/link';
import AutoLinks from './autoLinks';
import EmojiBlot from './blots/emoji';
import EmojiToolbar from './emoji';

export interface EditorContentChanged {
  html: string;
}

export type QuillEditorProps = {
  className?: string;
  placeholder: string;
  onChangeEditor: (content: EditorContentChanged) => void;
};

const RichTextEditor: React.FC<QuillEditorProps> = ({
  className,
  placeholder,
  onChangeEditor,
}) => {
  const [editorHtmlValue, setEditorHtmlValue] = useState<string>('');
  const [editorTextValue, setEditorTextValue] = useState<string>('');
  const [editorJsonValue, setEditorJsonValue] = useState<string>('');
  const reactQuillRef = useRef<ReactQuill>(null);

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

  const onChangeEditorContent = (content: string) => {
    setEditorHtmlValue(content);
    setEditorTextValue(content.replace(/<[^>]+>/g, ''));
    setEditorJsonValue(
      JSON.stringify(reactQuillRef.current?.getEditor().getContents()),
    );
    if (onChangeEditor) {
      onChangeEditor({
        html: content,
      });
    }
  };

  return (
    <>
      <ReactQuill
        id="quill"
        className={className}
        value={editorHtmlValue}
        modules={{ ...modules }}
        placeholder={placeholder}
        theme="snow"
        ref={reactQuillRef}
        formats={formats}
        onChange={onChangeEditorContent}
      />
      <Toolbar />
    </>
  );
};

export default memo(RichTextEditor);
