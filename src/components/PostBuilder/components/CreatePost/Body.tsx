import Actor from 'components/Actor';
import { CREATE_POST } from 'components/Actor/constant';
import PreviewLink from 'components/PreviewLink';
import { CreatePostContext, CreatePostFlow } from 'contexts/CreatePostContext';
import useAuth from 'hooks/useAuth';
import { IPost } from 'interfaces';
import { ForwardedRef, RefObject, forwardRef, useContext, useEffect, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import RichTextEditor from '../RichTextEditor';
import Toolbar from '../RichTextEditor/toolbar';
import Icon from 'components/Icon';
import { PostBuilderMode } from 'components/PostBuilder';
import { getTimeInScheduleFormat } from 'utils/time';
import { useCurrentTimezone } from 'hooks/useCurrentTimezone';
import Button, { Size, Variant } from 'components/Button';
import { operatorXOR } from 'utils/misc';
import { useTranslation } from 'react-i18next';
import Truncate from 'components/Truncate';
import AddLinkModal from './AddLinkModal';
import LinkPopup from './LinkPopup';

export interface IBodyProps {
  data?: IPost;
  dataTestId?: string;
  quillRef: RefObject<ReactQuill>;
  mode: PostBuilderMode;
  isFeedType: boolean;
}

const Body = forwardRef(
  (
    { data, dataTestId, quillRef, mode, isFeedType }: IBodyProps,
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
    const { t } = useTranslation('postBuilder');
    const { currentTimezone } = useCurrentTimezone();
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [selectedText, setSelectedText] = useState('');
    const [editingUrl, setEditingUrl] = useState('');
    const [linkPopup, setLinkPopup] = useState<{
      url: string;
      position: any;
      target: HTMLElement;
    } | null>(null);
    const [editingRange, setEditingRange] = useState<{ index: number; length: number } | null>(null);
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
    const onRequestLink = () => {
      const editor = quillRef.current?.getEditor();
      if (editor) {
        const range = editor.getSelection();
        if (range && range.length > 0) {
          setSelectedText(editor.getText(range.index, range.length));
        } else {
          setSelectedText('');
        }
      }
      setIsLinkModalOpen(true);
    };

    const closeLinkPopup = () => setLinkPopup(null);
    
    const normalizeUrl = (url: string) => {
      if (!url) return '';
      if (/^(https?:)?\/\//i.test(url)) return url;
      return `https://${url}`;
    };

    const handleEditLink = () => {
      const editor = quillRef.current?.getEditor();
      if (!editor || !linkPopup) return;

      const anchor = linkPopup.target as HTMLAnchorElement;
      const blot = Quill.find(anchor);
      if (!blot) return;

      const startIndex = blot.offset(editor.scroll);
      const length = (anchor.textContent || '').length;

      setEditingRange({ index: startIndex, length });
      setSelectedText(anchor.textContent || '');
      setEditingUrl(linkPopup.url);

      setIsLinkModalOpen(true);
      closeLinkPopup();
    };

    const handleAddLink = (linkText: string, url: string) => {
      const editor = quillRef.current?.getEditor();
      if (!editor) return;

      const normalizedUrl = normalizeUrl(url);
      if (editingRange) {
        const { index, length } = editingRange;

        const baseFormats = editor.getFormat(index, 1);

        if (linkText === selectedText) {
          editor.formatText(index, length, 'link', normalizedUrl);
        } else {
          const formats = { ...baseFormats, link: normalizedUrl };
          editor.deleteText(index, length);
          editor.insertText(index, linkText, formats);
        }

        setEditingRange(null);
      } else {
        const range = editor.getSelection(true);
        if (range) {
          editor.deleteText(range.index, range.length);
          editor.insertText(range.index, linkText, { link: normalizedUrl });
        }
      }

      setSelectedText('');
      setEditingUrl('');
      setIsLinkModalOpen(false);
    };

    useEffect(() => {
      const editor = quillRef.current?.getEditor();
      if (!editor) return;

      const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'A') {
          e.preventDefault();
          const linkUrl = target.getAttribute('href') || '';
          const containerRect = editor.root.getBoundingClientRect();
          const rect = target.getBoundingClientRect();
          setLinkPopup({
            url: linkUrl,
            position: {
              top: rect.top - containerRect.top + 158,
              left: rect.left - containerRect.left - 10,
              width: rect.width,
              height: rect.height,
            },
            target
          });
        }
      };

      editor.root.addEventListener('click', handleClick);
      return () => editor.root.removeEventListener('click', handleClick);
    }, []);

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
            <div className={`flex items-center cursor-pointer ${isFeedType && "hidden"}`}>
              {audience && audience.length > 0 ? (
                <div className="flex gap-2">
                  <Button
                    key={audience[0].entityId}
                    leftIcon="noteFavourite"
                    leftIconSize={16}
                    leftIconClassName="mr-1"
                    size={Size.Small}
                    variant={Variant.Secondary}
                    label={<Truncate text={audience[0]?.name || ''} />}
                    onClick={() => {
                      updateContext();
                      setActiveFlow(CreatePostFlow.Audience);
                    }}
                    className="group"
                    labelClassName="text-xss text-neutral-900 max-w-[128px] font-medium group-hover:text-primary-500"
                    dataTestId="createpost-selected-audience-list"
                  />
                  {audience && audience.length > 1 && (
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
              ) : audience && audience.length === 0 ? (
                <Button
                  variant={Variant.Secondary}
                  leftIcon={'profileUser'}
                  label="Everyone"
                  size={Size.Small}
                  onClick={() => {
                    updateContext();
                    setActiveFlow(CreatePostFlow.Audience);
                  }}
                  className="group"
                  labelClassName="text-xss text-neutral-900 font-medium group-hover:text-primary-500"
                  dataTestId={`createpost-audience`}
                />
              ) : (
                <Button
                  variant={Variant.Secondary}
                  leftIcon={'profileUser'}
                  leftIconClassName="text-neutral-900"
                  leftIconHover={false}
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
            placeholder={t('placeholder')}
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
                  onAddLink={onRequestLink}
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
          {linkPopup && (
            <LinkPopup
              url={linkPopup.url}
              position={linkPopup.position}
              onEdit={handleEditLink}
              onClose={closeLinkPopup}
            />
          )}
          <AddLinkModal
            isOpen={isLinkModalOpen}
            onClose={() => setIsLinkModalOpen(false)}
            onSave={handleAddLink}
            selectedText={selectedText}
            url={editingUrl}
          />
        </div>
      </div>
    );
  },
);

Body.displayName = 'Body';

export default Body;
