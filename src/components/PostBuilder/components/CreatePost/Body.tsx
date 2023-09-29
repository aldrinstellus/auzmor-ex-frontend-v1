import Actor from 'components/Actor';
import { CREATE_POST } from 'components/Actor/constant';
import PreviewLink from 'components/PreviewLink';
import { CreatePostContext, CreatePostFlow } from 'contexts/CreatePostContext';
import useAuth from 'hooks/useAuth';
import { IPost } from 'queries/post';
import { ForwardedRef, RefObject, forwardRef, useContext } from 'react';
import ReactQuill from 'react-quill';
import RichTextEditor from '../RichTextEditor';
import Toolbar from '../RichTextEditor/toolbar';
import Icon from 'components/Icon';
import { PostBuilderMode } from 'components/PostBuilder';
import { getTimeInScheduleFormat } from 'utils/time';
import { useCurrentTimezone } from 'hooks/useCurrentTimezone';
import Button, { Size, Variant } from 'components/Button';
import { operatorXOR } from 'utils/misc';

export interface IBodyProps {
  data?: IPost;
  dataTestId?: string;
  quillRef: RefObject<ReactQuill>;
  mode: PostBuilderMode;
}

const Body = forwardRef(
  (
    { data, dataTestId, quillRef, mode }: IBodyProps,
    ref: ForwardedRef<ReactQuill>,
  ) => {
    const {
      editorValue,
      schedule,
      setSchedule,
      setEditorValue,
      setActiveFlow,
      media,
      audience,
      previewUrl,
      isPreviewRemoved,
      poll,
    } = useContext(CreatePostContext);
    const { user } = useAuth();
    const { currentTimezone } = useCurrentTimezone();
    const updateContext = () => {
      setEditorValue({
        text: (ref as RefObject<ReactQuill>)
          .current!.makeUnprivilegedEditor(
            (ref as RefObject<ReactQuill>).current!.getEditor(),
          )
          .getText(),
        html: (ref as RefObject<ReactQuill>).current
          ?.makeUnprivilegedEditor(
            (ref as RefObject<ReactQuill>)!.current!.getEditor(),
          )
          .getHTML(),
        editor: (ref as RefObject<ReactQuill>).current
          ?.makeUnprivilegedEditor(
            (ref as RefObject<ReactQuill>)!.current!.getEditor(),
          )
          .getContents(),
      });
    };
    return (
      <div className="text-sm text-neutral-900">
        <div className="max-h-[75vh] overflow-y-auto flex flex-col gap-2">
          <div className="flex justify-between gap-3 items-center pt-6 px-6">
            <Actor
              contentMode={CREATE_POST}
              dataTestId={`${dataTestId}-creatorname`}
              disabled={true}
              createdBy={
                data?.createdBy || {
                  fullName: user?.name,
                  profileImage: {
                    id: '',
                    original: user?.profileImage || '',
                    blurHash: '',
                  },
                  email: user?.email,
                  workLocation: user?.workLocation?.name,
                }
              }
            />
            <div className="flex items-center cursor-pointer">
              {audience.length > 0 ? (
                <div className="flex gap-2">
                  <Button
                    key={audience[0].entityId}
                    leftIcon="noteFavourite"
                    leftIconSize={16}
                    leftIconClassName="mr-1"
                    size={Size.Small}
                    variant={Variant.Secondary}
                    label={(audience[0]?.entity as any)?.name || 'Team Name'}
                    onClick={() => {
                      updateContext();
                      setActiveFlow(CreatePostFlow.Audience);
                    }}
                    className="group"
                    labelClassName="text-xss text-neutral-900 font-medium group-hover:text-primary-500"
                    dataTestId="createpost-selected-audience-list"
                  />
                  {audience.length > 1 && (
                    <Button
                      key={audience[0].entityId}
                      variant={Variant.Secondary}
                      size={Size.Small}
                      label={`+ ${audience.length - 1} more`}
                      onClick={() => {
                        updateContext();
                        setActiveFlow(CreatePostFlow.Audience);
                      }}
                      className="group"
                      labelClassName="text-xss text-neutral-900 font-medium group-hover:text-primary-500"
                      dataTestId="createpost-more-audience"
                    />
                  )}
                </div>
              ) : (
                <Button
                  variant={Variant.Secondary}
                  leftIcon={'profileUser'}
                  label="Audience"
                  size={Size.Small}
                  onClick={() => {
                    updateContext();
                    setActiveFlow(CreatePostFlow.Audience);
                  }}
                  className="group"
                  labelClassName="text-xss text-neutral-900 font-medium group-hover:text-primary-500"
                  dataTestId={`createpost-audience`}
                />
              )}
            </div>
          </div>
          {schedule && (
            <div className="px-3 py-2 bg-primary-50 flex items-center gap-2 mx-6 my-2">
              <div>
                <Icon name="calendarTwo" size={16} />
              </div>
              <div className="flex-1">
                Post scheduled for{' '}
                {getTimeInScheduleFormat(
                  new Date(schedule.date),
                  schedule.time,
                  schedule.timezone,
                  currentTimezone,
                )}
              </div>

              <div className="flex gap-2">
                <div>
                  <Icon
                    name="edit"
                    size={16}
                    onClick={() => {
                      updateContext();
                      setActiveFlow(CreatePostFlow.SchedulePost);
                    }}
                    dataTestId="createpost-scheduledpost-editicon"
                  />
                </div>
                <div>
                  <Icon
                    name="close"
                    size={16}
                    onClick={() => setSchedule(null)}
                    dataTestId="createpost-scheduledpost-remove"
                  />
                </div>
              </div>
            </div>
          )}
          <RichTextEditor
            placeholder="What’s on your mind?"
            className={`max-h-64 overflow-y-auto ${
              !media.length &&
              !operatorXOR(isPreviewRemoved, !!previewUrl) &&
              !poll &&
              'min-h-[128px]'
            }`}
            defaultValue={editorValue.editor}
            ref={ref}
            mode={mode}
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
