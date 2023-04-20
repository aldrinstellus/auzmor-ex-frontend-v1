import React, { useState } from 'react';
import RichTextEditor, {
  EditorContentChanged,
} from 'components/RichTextEditor';
import Actor from 'components/Actor';
import { CREATE_POST } from 'components/Actor/constant';

type CreatePostProps = {
  onChangeEditor: (content: EditorContentChanged) => void;
};

const CreatePost: React.FC<CreatePostProps> = ({ onChangeEditor }) => {
  const [htmlValue, setHtmlValue] = useState<any>('');

  const onEditorContentChanged = (content: EditorContentChanged) => {
    setHtmlValue(content);
    onChangeEditor(content);
  };

  return (
    <>
      <Actor
        avatar="https://png.pngtree.com/png-clipart/20210619/ourlarge/pngtree-instagram-lady-social-media-flat-style-avatar-png-image_3483977.jpg"
        actorName="Sam Fields"
        visibility="Everyone"
        contentMode={CREATE_POST}
      />
      <RichTextEditor
        onChangeEditor={onEditorContentChanged}
        placeholder="What’s on your mind?"
        className="h-28 ml-4"
      />
    </>
  );
};

export default CreatePost;
