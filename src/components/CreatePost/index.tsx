import React, { useState } from 'react';
import RichTextEditor, {
  EditorContentChanged,
} from 'components/RichTextEditor';
import Actor from 'components/Actor';
import { CREATE_POST } from 'components/Actor/constant';
import { IAnnouncement } from 'pages/Feed/components/CreatePostModal';

interface ICreatePostProps {
  onChangeEditor: (content: EditorContentChanged) => void;
  announcement: IAnnouncement | null;
}

const CreatePost: React.FC<ICreatePostProps> = ({
  onChangeEditor,
  announcement,
}) => {
  return (
    <div className="max-h-[75vh] overflow-y-auto">
      <Actor
        avatar="https://png.pngtree.com/png-clipart/20210619/ourlarge/pngtree-instagram-lady-social-media-flat-style-avatar-png-image_3483977.jpg"
        actorName="Sam Fields"
        visibility="Everyone"
        contentMode={CREATE_POST}
      />
      <RichTextEditor
        placeholder="What’s on your mind?"
        className="max-h-64 overflow-y-auto min-h-[128px]"
        onChangeEditor={onChangeEditor}
        announcement={announcement}
      />
    </div>
  );
};

export default CreatePost;
