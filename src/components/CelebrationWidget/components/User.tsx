import React, { useMemo } from 'react';
import Avatar from 'components/Avatar';
import { CELEBRATION_TYPE } from '..';
import clsx from 'clsx';
import Button, { Size } from 'components/Button';
import {
  calculateWorkAnniversaryYears,
  formatDate,
  isCelebrationToday,
} from '../utils';
import { getNouns } from 'utils/misc';

interface UserProps {
  type: CELEBRATION_TYPE;
  hideSendWishBtn?: boolean;
}

const User: React.FC<UserProps> = ({ type, hideSendWishBtn = false }) => {
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
  const anniversaryYears = calculateWorkAnniversaryYears(
    '2021-08-29T10:45:50.336Z',
  );
  const celebrationDate =
    type === CELEBRATION_TYPE.Birthday
      ? formatDate('2023-08-29T10:45:50.336Z')
      : `${anniversaryYears} ${getNouns('yr', anniversaryYears)} (${formatDate(
          '2023-08-29T10:45:50.336Z',
        )})`;
  const showSendWishBtn =
    isCelebrationToday('2023-08-29T10:45:50.336Z') && !hideSendWishBtn;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-2 w-full justify-between">
        <div className="flex items-center gap-2">
          <Avatar name={'Sam Fields'} size={32} />
          <div className="flex flex-col">
            <p className="text-sm font-bold line-clamp-1">Sam Fields</p>
            <p className="text-xs line-clamp-1 text-neutral-500">
              Talent Acquisition specialist
            </p>
          </div>
        </div>
        <div
          className={`px-[6px] rounded-[4px] text-xs font-semibold whitespace-nowrap ${dateStyles}`}
        >
          {celebrationDate}
        </div>
      </div>
      {showSendWishBtn && (
        <Button
          size={Size.Small}
          className="!bg-blue-50 !text-blue-500 px-4 py-2 rounded-[8px]"
          label="Send them wishes"
        />
      )}
    </div>
  );
};

export default User;
