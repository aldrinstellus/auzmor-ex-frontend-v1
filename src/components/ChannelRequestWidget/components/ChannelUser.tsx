import clsx from 'clsx';
import Avatar from 'components/Avatar';
import Button, { Size, Variant } from 'components/Button';
import Icon from 'components/Icon';
import { IUserDetails } from 'queries/users';
// import { IGetUser } from 'queries/users';
import { FC, useMemo } from 'react';
import { getProfileImage } from 'utils/misc';

interface IUserRowProps {
  user: IUserDetails; // change type to IGetUser
  onClick?: () => void;
  className?: string;
  channelName?: '';
}

const ChannelUserRow: FC<IUserRowProps> = ({
  user,
  className = '',
  channelName = '',
}) => {
  const styles = useMemo(
    () =>
      clsx(
        {
          'flex items-center px-6 py-3 w-full  ': true,
        },
        {
          [className]: true,
        },
      ),
    [className],
  );
  return (
    <div className={styles}>
      <div className="flex items-center gap-2 flex-1">
        <Avatar
          name={user?.fullName || ''}
          size={32}
          image={getProfileImage(user)}
          dataTestId="user-profile-pic"
        />
        <div className="flex flex-col  truncate">
          <div
            data-testid="user-name"
            className="text-sm font-normal break-all"
          >
            <b>{user?.fullName || ''}</b> <span>requested to join </span>
            <b>{'Dummy Channel'}</b>
          </div>
          <div
            data-testid="user-email"
            className="text-neutral-500 space-x-1 pt-1 text-xs font-medium flex items-center"
          >
            {user.designation || 'Not specified'}
            <div className="w-1 h-1 ml-1 bg-neutral-500 rounded-full" />
            <Icon name="location" size={16} />
            <div
              data-testid="user-location"
              className="text-neutral-500 text-xs"
            >
              {user.workLocation || 'Not specified'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex  ml-auto space-x-1">
        <Button
          label="Decline"
          variant={Variant.Tertiary}
          size={Size.Small}
          onClick={() => {
            // TODO mutatable api call
          }}
          dataTestId={`requestwidget-viewall-${channelName}-decline`}
        />
        <Button
          label="Accept"
          variant={Variant.Primary}
          size={Size.Small}
          onClick={() => {
            // TODO mutatable api call
          }}
          dataTestId={`requestwidget-viewall-${channelName}-decline`}
        />
      </div>
    </div>
  );
};

export default ChannelUserRow;
