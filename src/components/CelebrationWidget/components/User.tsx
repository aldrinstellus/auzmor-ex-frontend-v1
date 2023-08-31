import React, { useContext, useMemo } from 'react';
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

interface UserProps {
  type: CELEBRATION_TYPE;
  hideSendWishBtn?: boolean;
  data: Record<string, any>;
}

const User: React.FC<UserProps> = ({ type, hideSendWishBtn = false, data }) => {
  const { user } = useContext(AuthContext);
  const { currentTimezone } = useCurrentTimezone();
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

  return (
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
        />
      )}
    </div>
  );
};

export default User;
