import clsx from 'clsx';
import Avatar from 'components/Avatar';
import Button, { Size, Variant } from 'components/Button';
// import { IGetUser } from 'queries/users';
import { FC, memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfileImage } from 'utils/misc';

interface IUserRowProps {
  user: any; // change type to IGetUser
  className?: string;
}

const ChannelWidgetUserRow: FC<IUserRowProps> = ({ user, className = '' }) => {
  const styles = useMemo(
    () =>
      clsx(
        {
          ' cursor-pointer  ': true,
        },
        {
          [className]: true,
        },
      ),
    [className],
  );
  const navigate = useNavigate();

  return (
    <div className={styles}>
      <div className="flex items-center gap-2 flex-1">
        <Avatar
          name={user?.fullName || ''}
          size={32}
          image={getProfileImage(user)}
          dataTestId="user-profile-pic"
          onClick={() => navigate(`/users/${user?.id}`)}
        />
        <div className="flex flex-col  line-clam-2">
          <div data-testid="user-name" className="text-xs font-normal ">
            <b onClick={() => navigate(`/users/${user?.id}`)}>
              {user?.fullName || ''}
            </b>{' '}
            <span>requested to join </span>
            <b>{user?.channel?.name || 'Dummy Channel'}</b>
          </div>
        </div>
      </div>
      <div className="flex my-2 justify-end space-x-1">
        <Button
          label="Decline"
          variant={Variant.Tertiary}
          size={Size.Small}
          onClick={() => {
            // TODO mutatable api call
          }}
          dataTestId="decline-Requestcta"
        />
        <Button
          label="Accept"
          variant={Variant.Primary}
          size={Size.Small}
          onClick={() => {
            // TODO mutatable api call
          }}
          dataTestId="accept-Requestcta"
        />
      </div>
    </div>
  );
};

export default memo(ChannelWidgetUserRow);
