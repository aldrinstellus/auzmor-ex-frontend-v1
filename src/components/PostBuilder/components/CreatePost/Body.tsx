import Actor from 'components/Actor';
import { CREATE_POST } from 'components/Actor/constant';
import PreviewLink from 'components/PreviewLink';
import { CreatePostContext, CreatePostFlow } from 'contexts/CreatePostContext';
import useAuth from 'hooks/useAuth';
import { IPost } from 'queries/post';
import { DeltaStatic } from 'quill';
import React, { ForwardedRef, Ref, useContext } from 'react';
import ReactQuill from 'react-quill';
import RichTextEditor from '../RichTextEditor';
import Toolbar from '../RichTextEditor/toolbar';
import Icon from 'components/Icon';
import moment from 'moment';
import { twConfig } from 'utils/misc';
import Button from 'components/Button';

export interface IBodyProps {
  data?: IPost;
  dataTestId?: string;
  quillRef: React.RefObject<ReactQuill>;
}

const Body = React.forwardRef(
  (
    { data, dataTestId, quillRef }: IBodyProps,
    ref: ForwardedRef<ReactQuill>,
  ) => {
    const {
      editorValue,
      schedule,
      setSchedule,
      setEditorValue,
      setActiveFlow,
    } = useContext(CreatePostContext);
    const { user } = useAuth();
    return (
      <div className="text-sm text-neutral-900">
        <div className="max-h-[75vh] overflow-y-auto">
          <Actor
            visibility="Everyone"
            contentMode={CREATE_POST}
            dataTestId={`${dataTestId}-creatorname`}
            disabled={true}
            createdBy={
              data?.createdBy || {
                fullName: user?.name,
                profileImage: { id: '', original: user?.profileImage || '' },
              }
            }
          />
          {schedule && (
            <div className="px-3 py-2 bg-primary-50 flex justify-between mx-4 mb-4">
              <div className="flex">
                <div className="mr-2">
                  <Icon name="calendarTwo" size={16} />
                </div>
                <div>
                  Post scheduled for{' '}
                  {moment(new Date(schedule.date)).format('ddd, MMM DD')} at{' '}
                  {schedule.time} , based on your profile timezone.
                </div>
              </div>
              <div className="flex">
                <div className="mr-4">
                  <Icon
                    name="edit"
                    size={16}
                    onClick={() => {
                      setEditorValue({
                        text: (ref as React.RefObject<ReactQuill>)
                          .current!.makeUnprivilegedEditor(
                            (
                              ref as React.RefObject<ReactQuill>
                            ).current!.getEditor(),
                          )
                          .getText(),
                        html: (ref as React.RefObject<ReactQuill>).current
                          ?.makeUnprivilegedEditor(
                            (ref as React.RefObject<ReactQuill>)!.current!.getEditor(),
                          )
                          .getHTML(),
                        json: (ref as React.RefObject<ReactQuill>).current
                          ?.makeUnprivilegedEditor(
                            (ref as React.RefObject<ReactQuill>)!.current!.getEditor(),
                          )
                          .getContents(),
                      });
                      setActiveFlow(CreatePostFlow.SchedulePost);
                    }}
                  />
                </div>
                <div>
                  <Icon
                    name="close"
                    size={16}
                    onClick={() => setSchedule(null)}
                  />
                </div>
              </div>
            </div>
          )}
          <RichTextEditor
            placeholder="What’s on your mind?"
            className="max-h-64 overflow-y-auto min-h-[128px]"
            defaultValue={
              data?.content?.editor || (editorValue.json as DeltaStatic)
            }
            ref={ref}
            renderToolbar={(isCharLimit: boolean) => {
              return (
                <Toolbar
                  isCharLimit={isCharLimit}
                  dataTestId={dataTestId}
                  quillRef={quillRef}
                />
              );
            }}
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
