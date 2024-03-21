import {
  ForwardedRef,
  LegacyRef,
  ReactNode,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import ReactQuill, { Quill, UnprivilegedEditor } from 'react-quill';
import { DeltaStatic, Sources } from 'quill';
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';

// Issue Identitfied - in this folder quill mention does not applied
import './mentions/quill.mention.css';

import { MentionBlot } from './mentions/blots/mentions';
import { LinkBlot } from './blots/link';
import AutoLinks from './autoLinks';
import EmojiBlot from './blots/emoji';
import EmojiToolbar from './emoji';
import { mention, previewLinkRegex } from './config';
import Icon from 'components/Icon';
import {
  hideMentionHashtagPalette,
  isEmptyEditor,
  removeEmptyLines,
  twConfig,
} from 'utils/misc';
import {
  CreatePostContext,
  CreatePostFlow,
  IMediaValidationError,
  MediaValidationError,
} from 'contexts/CreatePostContext';
import moment from 'moment';
import MediaPreview, { Mode } from 'components/MediaPreview';
import Banner, { Variant } from 'components/Banner';
import { hasDatePassed } from 'utils/time';
import Poll, { PollMode } from 'components/Poll';
import { PostBuilderMode } from 'components/PostBuilder';
import useModal from 'hooks/useModal';
import ConfirmationBox from 'components/ConfirmationBox';
import { PostType } from 'queries/post';

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
  renderToolbar?: (isCharLimit: boolean) => ReactNode;
  renderPreviewLink?: (
    previewUrl: string,
    setPreviewUrl: (previewUrl: string) => void,
    setIsPreviewRemove: (isPreviewRemove: boolean) => void,
  ) => ReactNode;
  dataTestId?: string;
  mode: PostBuilderMode;
}

const RichTextEditor = forwardRef(
  (
    {
      className,
      placeholder,
      charLimit = 3000,
      defaultValue,
      renderToolbar = () => <div id="toolbar"></div>,
      renderPreviewLink,
      dataTestId,
      mode,
    }: IQuillEditorProps,
    ref: ForwardedRef<ReactQuill>,
  ) => {
    const {
      announcement,
      setAnnouncement,
      setActiveFlow,
      setEditorValue,
      media,
      inputImgRef,
      isPreviewRemoved,
      isCharLimit,
      setIsCharLimit,
      setIsEmpty,
      setIsPreviewRemoved,
      removeAllMedia,
      coverImageMap,
      mediaValidationErrors,
      setMediaValidationErrors,
      setMediaOpenIndex,
      previewUrl,
      setPreviewUrl,
      poll,
      // setPoll,
      setShoutoutUserIds,
      postType,
      setPostType,
    } = useContext(CreatePostContext);

    const formats = [
      'bold',
      'italic',
      'underline',
      'mention',
      'link',
      'emoji',
      'color',
    ];

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
      if (!!!ref || !!!(ref as any)?.current || source === 'silent') {
        return;
      }
      if (editor.getLength() > charLimit) {
        ((ref as any).current as ReactQuill).getEditor().formatText(
          charLimit - 1,
          editor.getLength() - charLimit,
          {
            color: twConfig.theme.colors.red['500'],
          },
          'silent',
        );
        setIsCharLimit(true);
      } else {
        setIsCharLimit(false);
      }

      if (!isPreviewRemoved) {
        const matches = editor.getText().match(previewLinkRegex);
        if (matches) {
          setPreviewUrl(matches[0]);
        } else {
          setPreviewUrl('');
        }
      }

      const refinedContent = removeEmptyLines({
        editor: editor.getContents(),
        text: editor.getText(),
        html: editor.getHTML(),
      });
      setIsEmpty(
        isEmptyEditor(refinedContent.text, refinedContent.editor.ops || []),
      );
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

    const getMediaValidationErrors = useCallback(() => {
      let imageSizeExceedCount = 0;
      let videoSizeExceedCount = 0;
      let mediaLengthExceedCount = 0;
      let invalidFileTypeCount = 0;

      const errors: IMediaValidationError[] = [];
      mediaValidationErrors.forEach((eachError) => {
        if (eachError.errorType === MediaValidationError.ImageSizeExceed) {
          imageSizeExceedCount += 1;
        }
        if (eachError.errorType === MediaValidationError.VideoSizeExceed) {
          videoSizeExceedCount += 1;
        }
        if (eachError.errorType === MediaValidationError.MediaLengthExceed) {
          mediaLengthExceedCount += 1;
        }
        if (eachError.errorType === MediaValidationError.FileTypeNotSupported) {
          invalidFileTypeCount += 1;
        }
      });

      if (imageSizeExceedCount === 1) {
        errors.push(
          mediaValidationErrors.find(
            (error) => error.errorType === MediaValidationError.ImageSizeExceed,
          )!,
        );
      } else if (imageSizeExceedCount > 1) {
        errors.push({
          errorType: MediaValidationError.ImageSizeExceed,
          errorMsg:
            'Some images are droped. An Image can not exceeded 5MB limit size. Please try again later',
        });
      }

      if (videoSizeExceedCount === 1) {
        errors.push(
          mediaValidationErrors.find(
            (error) => error.errorType === MediaValidationError.VideoSizeExceed,
          )!,
        );
      } else if (videoSizeExceedCount > 1) {
        errors.push({
          errorType: MediaValidationError.VideoSizeExceed,
          errorMsg:
            'Some videos are droped. A Video can not exceeded 2GB limit size. Please try again later',
        });
      }

      if (mediaLengthExceedCount !== 0) {
        errors.push(
          mediaValidationErrors.find(
            (error) =>
              error.errorType === MediaValidationError.MediaLengthExceed,
          )!,
        );
      }

      if (invalidFileTypeCount) {
        errors.push({
          errorType: MediaValidationError.FileTypeNotSupported,
          errorMsg: 'File type not supported. Upload a supported file content',
        });
      }
      return errors;
    }, [mediaValidationErrors]);

    const getDataTestIdForErrors = (errorType: MediaValidationError) => {
      switch (errorType) {
        case MediaValidationError.MediaLengthExceed:
          return 'createpost-maxnumberuploadlimitreached-error';
        case MediaValidationError.ImageSizeExceed:
          return 'createpost-imageuploadlimitreached-error';
        case MediaValidationError.VideoSizeExceed:
          return 'createpost-videouploadlimitreached-error';
        case MediaValidationError.FileTypeNotSupported:
          return 'createpost-filetypenotsupported-error';
      }
    };

    const onRemoveMedia = () => {
      removeAllMedia();
      setShoutoutUserIds([]);
      setPostType(PostType.Update);
      closeConfirm();
    };

    const onMediaEdit = () => {
      updateContext();
      if (postType === PostType.Shoutout) {
        setActiveFlow(CreatePostFlow.CreateShoutout);
      } else {
        setActiveFlow(CreatePostFlow.EditMedia);
      }
    };

    const [confirm, showConfirm, closeConfirm] = useModal();

    useEffect(() => {
      if (ref && ((ref as any).current as ReactQuill)) {
        const editor = ((ref as any).current as ReactQuill).getEditor();
        const refinedContent = removeEmptyLines({
          editor: editor.getContents(),
          text: editor.getText(),
          html: editor.getText(),
        });
        setIsEmpty(
          isEmptyEditor(refinedContent.text, refinedContent.editor.ops || []),
        );
      }
    }, []);

    useEffect(() => () => hideMentionHashtagPalette(), []);

    return (
      <div data-testid={`${dataTestId}-content`}>
        <ReactQuill
          id="createpost-quill"
          className={className}
          modules={{ ...modules }}
          placeholder={placeholder}
          theme="snow"
          ref={ref as LegacyRef<ReactQuill>}
          formats={formats}
          onChange={onChangeEditorContent}
          defaultValue={defaultValue}
        />
        {announcement?.label && !hasDatePassed(announcement.value) && (
          <div className="flex justify-between bg-blue-50 px-4 py-2 m-4">
            <div className="flex items-center">
              <Icon
                name="micOutline"
                hover={false}
                size={16}
                color="text-neutral-900"
              />
              <div
                className="ml-2.5"
                data-testid="announcement-scheduled-toaster"
              >
                Announcement will expire on{' '}
                {moment(new Date(announcement.value)).format(
                  'ddd, MMM DD [at] h:mm a',
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="cursor-pointer"
                onClick={() => {
                  updateContext();
                  setActiveFlow(CreatePostFlow.CreateAnnouncement);
                }}
                data-testid="announcement-toaster-editicon"
              >
                <Icon name="editOutline" size={12} color="text-neutral-900" />
              </div>
              <div
                className="cursor-pointer"
                onClick={() => setAnnouncement(null)}
                data-testid="announcement-toaster-closeicon"
              >
                <Icon name="close" size={12} color="text-neutral-900" />
              </div>
            </div>
          </div>
        )}
        {media.length > 0 && (
          <MediaPreview
            media={media}
            className="m-6"
            mode={Mode.Edit}
            onAddButtonClick={() => inputImgRef?.current?.click()}
            onCloseButtonClick={media.length > 1 ? showConfirm : onRemoveMedia}
            showEditButton={true}
            showCloseButton={true}
            showAddMediaButton={postType !== PostType.Shoutout}
            onEditButtonClick={onMediaEdit}
            coverImageMap={coverImageMap}
            dataTestId={dataTestId}
            onClick={(e, index) => {
              updateContext();
              if (postType !== PostType.Shoutout) {
                setMediaOpenIndex(index - 1);
                setActiveFlow(CreatePostFlow.EditMedia);
              }
            }}
          />
        )}
        {poll && (
          <div className="px-2 py-2 m-4">
            <Poll
              question={poll.question}
              options={poll.options}
              total={poll.total}
              closedAt={poll.closedAt}
              mode={PollMode.EDIT}
              isDeletable={mode === PostBuilderMode.Create}
            />
          </div>
        )}
        {getMediaValidationErrors().map((error, index) => (
          <div className="mx-8 mb-1" key={index}>
            <Banner
              title={error.errorMsg}
              variant={Variant.Error}
              action={<></>}
              onClose={() =>
                setMediaValidationErrors([
                  ...mediaValidationErrors.filter(
                    (mediaError) => mediaError.errorType !== error.errorType,
                  ),
                ])
              }
              dataTestId={getDataTestIdForErrors(error.errorType)}
            />
          </div>
        ))}
        {!isPreviewRemoved &&
          renderPreviewLink &&
          renderPreviewLink(previewUrl, setPreviewUrl, setIsPreviewRemoved)}
        {renderToolbar && renderToolbar(isCharLimit)}
        <ConfirmationBox
          open={confirm}
          onClose={closeConfirm}
          title="Delete media?"
          description={
            <span>
              Are you sure you want to delete the media? This cannot be undone
            </span>
          }
          success={{
            label: 'Delete',
            className: 'bg-red-500 text-white ',
            onSubmit: onRemoveMedia,
          }}
          discard={{
            label: 'Cancel',
            className: 'text-neutral-900 bg-white ',
            onCancel: closeConfirm,
          }}
        />
      </div>
    );
  },
);

RichTextEditor.displayName = 'RichTextEditor';

export default memo(RichTextEditor);
