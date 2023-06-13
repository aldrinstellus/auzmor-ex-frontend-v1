import React, {
  LegacyRef,
  ReactNode,
  memo,
  useCallback,
  useContext,
  useState,
} from 'react';
import ReactQuill, { Quill, UnprivilegedEditor } from 'react-quill';
import { DeltaStatic, Sources, Delta } from 'quill';
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
import './mentions/quill.mention';
import './mentions/quill.mention.css';

import { MentionBlot } from './mentions/blots/mentions';
import { LinkBlot } from './blots/link';
import AutoLinks from './autoLinks';
import EmojiBlot from './blots/emoji';
import EmojiToolbar from './emoji';
import { mention, previewLinkRegex } from './config';
import Icon from 'components/Icon';
import { twConfig } from 'utils/misc';
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
}

const RichTextEditor = React.forwardRef(
  (
    {
      className,
      placeholder,
      charLimit = 3000,
      defaultValue,
      renderToolbar = () => <div id="toolbar"></div>,
      renderPreviewLink,
      dataTestId,
    }: IQuillEditorProps,
    ref: React.ForwardedRef<ReactQuill>,
  ) => {
    const {
      announcement,
      setActiveFlow,
      setEditorValue,
      media,
      inputImgRef,
      isPreviewRemoved,
      isCharLimit,
      setIsCharLimit,
      setIsPreviewRemoved,
      removeAllMedia,
      coverImageMap,
      mediaValidationErrors,
      setMediaValidationErrors,
    } = useContext(CreatePostContext);

    const [previewUrl, setPreviewUrl] = useState<string>('');

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
    };

    const updateContext = () => {
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
    };

    const getMediaValidationErrors = useCallback(() => {
      let imageSizeExceedCount = 0;
      let videoSizeExceedCount = 0;
      let mediaLengthExceedCount = 0;

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
      return errors;
    }, [mediaValidationErrors]);

    return (
      <div data-testid={`${dataTestId}-content`}>
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
        {media.length > 0 && (
          <MediaPreview
            media={media}
            className="m-6"
            mode={Mode.Edit}
            onAddButtonClick={() => inputImgRef?.current?.click()}
            onCloseButtonClick={removeAllMedia}
            onEditButtonClick={() => {
              updateContext();
              setActiveFlow(CreatePostFlow.EditMedia);
            }}
            coverImageMap={coverImageMap}
            dataTestId={dataTestId}
          />
        )}
        {announcement?.label && !hasDatePassed(announcement.value) && (
          <div className="flex justify-between bg-primary-100 px-4 py-2 m-4">
            <div className="flex items-center">
              <Icon
                name="calendarOutlineTwo"
                size={16}
                stroke={twConfig.theme.colors.neutral['900']}
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
            <div
              className="flex items-center cursor-pointer"
              onClick={() => {
                updateContext();
                setActiveFlow(CreatePostFlow.CreateAnnouncement);
              }}
              data-testId="announcement-toaster-editicon"
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
            />
          </div>
        ))}
        {!isPreviewRemoved &&
          renderPreviewLink &&
          renderPreviewLink(previewUrl, setPreviewUrl, setIsPreviewRemoved)}
        {renderToolbar && renderToolbar(isCharLimit)}
      </div>
    );
  },
);

RichTextEditor.displayName = 'RichTextEditor';

export default memo(RichTextEditor);
