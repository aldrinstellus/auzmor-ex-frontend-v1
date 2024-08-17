import { FC, memo, useContext, useMemo, useState } from 'react';
import truncate from 'lodash/truncate';
import Avatar from 'components/Avatar';
import { CELEBRATION_TYPE } from '..';
import clsx from 'clsx';
import Button, { Size } from 'components/Button';
import { isCelebrationToday } from '../utils';
import { getFullName, getNouns, getProfileImage } from 'utils/misc';
import { AuthContext } from 'contexts/AuthContext';
import { useCurrentTimezone } from 'hooks/useCurrentTimezone';
import Icon from 'components/Icon';
import {
  CommentsRTE,
  PostCommentMode,
} from 'components/Comments/components/CommentsRTE';
import { useUploadState } from 'hooks/useUploadState';
import { validImageTypesForComments } from 'components/Comments';
import {
  IMG_FILE_SIZE_LIMIT,
  IMediaValidationError,
  MediaValidationError,
} from 'contexts/CreatePostContext';
import { useNavigate } from 'react-router-dom';
import Tooltip from 'components/Tooltip';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

interface UserProps {
  id: string;
  type: CELEBRATION_TYPE;
  isModalView?: boolean;
  data: Record<string, any>;
  onSendWish?: () => void;
  closeModal?: () => void;
}

const User: FC<UserProps> = ({
  id,
  type,
  isModalView = false,
  data,
  onSendWish,
  closeModal,
}) => {
  const { t } = useTranslation('celebrationWidget');
  const { featuredUser, post } = data;
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { currentTimezone } = useCurrentTimezone();
  const {
    inputRef,
    media,
    setMedia,
    files,
    setFiles,
    mediaValidationErrors,
    setMediaValidationErrors,
    setUploads,
  } = useUploadState();
  const [isCreateCommentLoading, setIsCreateCommentLoading] = useState(false);

  const userTimezone = user?.timezone || currentTimezone || 'Asia/Kolkata';
  const isBirthday = type === CELEBRATION_TYPE.Birthday;
  const anniversaryYears = data.diffInYears || 0;
  const celebrationDate = isBirthday
    ? moment(data.nextOcassionDateTime).format('D MMM')
    : `${anniversaryYears} ${getNouns('yr', anniversaryYears)} (${moment(
        data.nextOcassionDateTime,
      ).format('D MMM')})`;

  const userIsMe = user?.id === featuredUser.userId;

  const showSendWishBtn =
    isCelebrationToday(data.nextOcassionDateTime, userTimezone) &&
    post?.id &&
    !isModalView;

  const alreadyWished = post?.id && post.myCommentsOnPost.length > 0;

  // if post exist then only allow user to wish
  const showSendWishRTELayout =
    isModalView &&
    post?.id &&
    (isCelebrationToday(data.nextOcassionDateTime, userTimezone) ||
      alreadyWished);

  const dateStyles = useMemo(
    () =>
      clsx(
        {
          'text-blue-500  bg-blue-100': type === CELEBRATION_TYPE.Birthday,
        },
        {
          'text-pink-500  bg-pink-100':
            type === CELEBRATION_TYPE.WorkAnniversary,
        },
      ),
    [type],
  );

  const wishesSent = useMemo(
    () => (
      <div
        data-testid={`${isBirthday ? 'birthday' : 'anniversaries'}-wishes-sent`}
        className={`py-[2px] px-[6px] rounded-[4px] text-xs font-bold flex items-center ${dateStyles} w-fit whitespace-nowrap`}
      >
        {t('wishes-sent')}
      </div>
    ),
    [],
  );

  const wishText = isBirthday
    ? `${t('wish-text-bth')}`
    : `${t('wish-text-ann')}`;

  return showSendWishRTELayout ? (
    <div className="flex gap-2 w-full">
      <Avatar
        name={getFullName(featuredUser) || featuredUser.email}
        image={getProfileImage(featuredUser)}
        size={48}
        className="min-w-[48px] cursor-pointer"
        onClick={() => navigate(`/users/${id}`)}
      />
      <div
        className={clsx(
          'flex flex-col gap-3 flex-grow w-0',
          '!gap-2',
          alreadyWished,
        )}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <p
              className="text-sm font-bold line-clamp-1 cursor-pointer"
              data-testid={`${
                isBirthday ? 'birthday' : 'anniversaries'
              }-profile-name`}
              onClick={() => navigate(`/users/${id}`)}
            >
              {getFullName(featuredUser) || featuredUser.email}
            </p>
            {featuredUser.designation && (
              <>
                <div className="rounded w-1 h-1 bg-neutral-500" />
                <p className="text-xs line-clamp-1 text-neutral-500">
                  {featuredUser.designation}
                </p>
              </>
            )}
          </div>
          <div
            className="flex items-center gap-1 text-primary-500 text-xs font-bold cursor-pointer"
            data-testid={`view-${
              isBirthday ? 'birthday' : 'anniversaries'
            }-post`}
            onClick={() => {
              closeModal && closeModal();
              navigate(`/posts/${post.id}`);
            }}
          >
            ${t('visit-post')}
            <Icon name="arrowRightUp" size={12} color="text-primary-500" />
          </div>
        </div>
        {userIsMe ? (
          <div className="text-neutral-900 text-xs leading-normal font-normal">
            {wishText}
          </div>
        ) : alreadyWished ? (
          wishesSent
        ) : (
          <CommentsRTE
            entityId={post?.id}
            entityType="post"
            className="w-full"
            wrapperClassName="!py-[7px]"
            mode={PostCommentMode.SendWish}
            inputRef={inputRef}
            media={media}
            removeMedia={() => {
              setMedia([]);
              setFiles([]);
              setMediaValidationErrors([]);
              inputRef!.current!.value = '';
            }}
            files={files}
            mediaValidationErrors={mediaValidationErrors}
            setIsCreateCommentLoading={setIsCreateCommentLoading}
            setMediaValidationErrors={setMediaValidationErrors}
            isCreateCommentLoading={isCreateCommentLoading}
            toolbarId={`toolbar-for-${id}`}
          />
        )}
        <input
          type="file"
          className="hidden"
          ref={inputRef}
          accept={validImageTypesForComments.join(',')}
          onChange={(e) => {
            const mediaErrors: IMediaValidationError[] = [];
            if (e.target.files?.length) {
              setUploads(
                Array.prototype.slice
                  .call(e.target.files)
                  .filter((eachFile: File) => {
                    if (
                      !!![...validImageTypesForComments].includes(eachFile.type)
                    ) {
                      mediaErrors.push({
                        errorMsg: `File (${eachFile.name}) type not supported. Upload a supported file content`,
                        errorType: MediaValidationError.FileTypeNotSupported,
                        fileName: eachFile.name,
                      });
                      return false;
                    }
                    if (eachFile.type.match('image')) {
                      if (eachFile.size > IMG_FILE_SIZE_LIMIT * 1024 * 1024) {
                        mediaErrors.push({
                          errorType: MediaValidationError.ImageSizeExceed,
                          errorMsg: `The file “${eachFile.name}" you are trying to upload exceeds the 50MB attachment limit. Try uploading a smaller file`,
                          fileName: eachFile.name,
                        });
                        return false;
                      }
                      return true;
                    }
                  })
                  .map(
                    (eachFile: File) =>
                      new File(
                        [eachFile],
                        `id-${Math.random().toString(16).slice(2)}-${
                          eachFile.name
                        }`,
                        { type: eachFile.type },
                      ),
                  ),
              );
              setMediaValidationErrors([...mediaErrors]);
            }
          }}
          data-testid="comment-uploadphoto"
          aria-label="file input"
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-2 w-full justify-between">
        <div className="flex items-center gap-2">
          <Avatar
            name={getFullName(featuredUser) || featuredUser.email}
            image={getProfileImage(featuredUser)}
            size={32}
            className="min-w-[32px] cursor-pointer"
            onClick={() =>
              navigate(id === user?.id ? '/profile' : `/users/${id}`)
            }
          />
          <div className="flex flex-col">
            <Tooltip
              tooltipContent={getFullName(featuredUser) || featuredUser.email}
              showTooltip={
                (getFullName(featuredUser) || featuredUser.email).length >
                (isModalView ? 40 : 18)
              }
            >
              <p
                className="text-sm font-bold truncate cursor-pointer  "
                data-testid={`${
                  isBirthday ? 'birthday' : 'anniversaries'
                }-profile-name`}
                onClick={() =>
                  navigate(id === user?.id ? '/profile' : `/users/${id}`)
                }
              >
                {truncate(getFullName(featuredUser) || featuredUser.email, {
                  length: isModalView ? 40 : 18,
                  separator: '',
                })}
              </p>
            </Tooltip>

            {featuredUser.designation && (
              <Tooltip
                tooltipContent={featuredUser.designation}
                showTooltip={
                  featuredUser.designation.length > (isModalView ? 40 : 24)
                }
              >
                <p className="text-xs truncate text-neutral-500 ">
                  {truncate(featuredUser.designation, {
                    length: isModalView ? 40 : 24,
                    separator: '',
                  })}
                </p>
              </Tooltip>
            )}
          </div>
        </div>
        {alreadyWished ? (
          wishesSent
        ) : (
          <div
            className={`px-[6px] rounded-[4px] text-xs font-semibold whitespace-nowrap ${dateStyles}`}
            data-testid={`${isBirthday ? 'birthday' : 'anniversaries'}-date`}
          >
            {t('celebration-date', { date: `${celebrationDate}`.trim() })}
          </div>
        )}
      </div>
      {userIsMe && showSendWishBtn ? (
        <div className="text-neutral-900 text-xs leading-normal font-normal">
          {wishText}
        </div>
      ) : null}
      {alreadyWished ||
      (userIsMe && (showSendWishBtn || showSendWishRTELayout)) ? (
        <Button
          size={Size.Small}
          className="!bg-primary-50 !text-primary-500 px-4 py-2 rounded-[8px]"
          label={t('visit-post')}
          data-testid={`view-${isBirthday ? 'birthday' : 'anniversaries'}-post`}
          onClick={() => navigate(`/posts/${post.id}`)}
        />
      ) : (
        showSendWishBtn && (
          <Button
            size={Size.Small}
            className="!bg-blue-50 !text-blue-500 px-4 py-2 rounded-[8px]"
            label={t('send-wishes-cta')}
            dataTestId={`${
              isBirthday ? 'birthday' : 'anniversaries'
            }-send-wishes-cta`}
            onClick={onSendWish}
          />
        )
      )}
    </div>
  );
};

export default memo(User);
