import React, { useContext, useMemo, useState } from 'react';
import Avatar from 'components/Avatar';
import { CELEBRATION_TYPE } from '..';
import clsx from 'clsx';
import Button, { Size } from 'components/Button';
import {
  calculateWorkAnniversaryYears,
  formatDate,
  isCelebrationToday,
} from '../utils';
import { getFullName, getNouns } from 'utils/misc';
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

interface UserProps {
  type: CELEBRATION_TYPE;
  hideSendWishBtn?: boolean;
  data: Record<string, any>;
  onSendWish?: () => void;
}

const User: React.FC<UserProps> = ({
  type,
  hideSendWishBtn = false,
  data,
  onSendWish,
}) => {
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
  const anniversaryYears = calculateWorkAnniversaryYears(
    data.joinDate,
    userTimezone,
  );
  const isBirthday = type === CELEBRATION_TYPE.Birthday;
  const celebrationDate = isBirthday
    ? formatDate(data.dateOfBirth, userTimezone)
    : `${anniversaryYears} ${getNouns('yr', anniversaryYears)} (${formatDate(
        data.joinDate,
        userTimezone,
      )})`;

  const showSendWishBtn =
    isCelebrationToday(
      isBirthday ? data.dateOfBirth : data.joinDate,
      userTimezone,
    ) && !hideSendWishBtn;
  const showSendWishRTE = hideSendWishBtn;

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

  return showSendWishRTE ? (
    <div className="flex gap-2 w-full">
      <Avatar
        name={getFullName(data.featuredUser)}
        size={48}
        className="min-w-[48px]"
      />
      <div className="flex flex-col gap-3 w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <p
              className="text-sm font-bold line-clamp-1"
              data-testid={`${
                isBirthday ? 'birthday' : 'anniversaries'
              }-profile-name`}
            >
              {getFullName(data.featuredUser)}
            </p>
            {data.featuredUser.designation && (
              <>
                <div className="rounded w-1 h-1 bg-neutral-500" />
                <p className="text-xs line-clamp-1 text-neutral-500">
                  {data.featuredUser.designation}
                </p>
              </>
            )}
          </div>
          <div
            className="flex items-center gap-1 text-primary-500 text-xs font-bold cursor-pointer"
            data-testid={`${
              isBirthday ? 'birthday' : 'anniversaries'
            }-visit-post`}
          >
            Visit post
            <Icon name="arrowRightUp" size={12} color="text-primary-500" />
          </div>
        </div>
        <CommentsRTE
          entityId={data.featuredUser.userId}
          entityType="post"
          className="w-full"
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
        />
        <input
          type="file"
          className="hidden"
          ref={inputRef}
          accept={validImageTypesForComments.join(',')}
          onChange={(e) => {
            console.log(e);
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
                          errorMsg: `The file “${eachFile.name}" you are trying to upload exceeds the 5MB attachment limit. Try uploading a smaller file`,
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
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-2 w-full justify-between">
        <div className="flex items-center gap-2">
          <Avatar
            name={getFullName(data.featuredUser)}
            size={32}
            className="min-w-[32px]"
          />
          <div className="flex flex-col">
            <p
              className="text-sm font-bold line-clamp-1"
              data-testid={`${
                isBirthday ? 'birthday' : 'anniversaries'
              }-profile-name`}
            >
              {getFullName(data.featuredUser)}
            </p>
            {data.featuredUser.designation && (
              <p className="text-xs line-clamp-1 text-neutral-500">
                {data.featuredUser.designation}
              </p>
            )}
          </div>
        </div>
        <div
          className={`px-[6px] rounded-[4px] text-xs font-semibold whitespace-nowrap ${dateStyles}`}
          data-testid={`${isBirthday ? 'birthday' : 'anniversaries'}-date`}
        >
          {celebrationDate}
        </div>
      </div>
      {showSendWishBtn && (
        <Button
          size={Size.Small}
          className="!bg-blue-50 !text-blue-500 px-4 py-2 rounded-[8px]"
          label="Send them wishes"
          dataTestId={`${
            isBirthday ? 'birthday' : 'anniversaries'
          }-send-wishes-cta`}
          onClick={onSendWish}
        />
      )}
    </div>
  );
};

export default User;
