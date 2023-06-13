import Actor from 'components/Actor';
import { CREATE_POST } from 'components/Actor/constant';
import PreviewLink from 'components/PreviewLink';
import { CreatePostContext } from 'contexts/CreatePostContext';
import { IPost } from 'queries/post';
import { DeltaStatic } from 'quill';
import React, { ForwardedRef, useContext } from 'react';
import ReactQuill from 'react-quill';
import RichTextEditor from '../RichTextEditor';
import Toolbar from '../RichTextEditor/toolbar';

export interface IBodyProps {
  data?: IPost;
  dataTestId?: string;
}

const Body = React.forwardRef(
  ({ data, dataTestId }: IBodyProps, ref: ForwardedRef<ReactQuill>) => {
    const { editorValue } = useContext(CreatePostContext);
    return (
      <div className="text-sm text-neutral-900">
        <div className="max-h-[75vh] overflow-y-auto">
          <Actor
            visibility="Everyone"
            contentMode={CREATE_POST}
            dataTestId={`${dataTestId}-creatorname`}
            disabled={true}
            createdBy={data?.createdBy}
          />
          <RichTextEditor
            placeholder="What’s on your mind?"
            className="max-h-64 overflow-y-auto min-h-[128px]"
            defaultValue={
              data?.content?.editor || (editorValue.json as DeltaStatic)
            }
            ref={ref}
            renderToolbar={(isCharLimit: boolean) => (
              <Toolbar isCharLimit={isCharLimit} dataTestId={dataTestId} />
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
            dataTestId={dataTestId}
          />
        </div>
      </div>
    );
  },
);

Body.displayName = 'Body';

export default Body;
