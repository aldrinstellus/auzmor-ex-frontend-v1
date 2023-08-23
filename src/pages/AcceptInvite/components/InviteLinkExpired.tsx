import Icon from 'components/Icon';
import { Logo } from 'components/Logo';
import React, { ReactElement } from 'react';

interface IInviteLinkExpiredProps {
  message?: string;
}

const InviteLinkExpired: React.FC<IInviteLinkExpiredProps> = ({
  message,
}: IInviteLinkExpiredProps): ReactElement => {
  return (
    <div className="relative">
      <div className="mt-4 right-2 absolute">
        <Logo />
      </div>
      <div className="w-screen h-screen flex flex-col items-center justify-center gap-y-3">
        <Icon name="infoCircle" color="#F05252" hover size={50} />
        {message ? (
          <p className="font-normal text-neutral-900 text-sm">{message}</p>
        ) : (
          <>
            <p className="font-extrabold text-neutral-900 text-2xl">
              INVITE LINK HAS EXPIRED
            </p>
            <p className="font-normal text-neutral-900 text-sm">
              Please ask the admin to invite you again.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default InviteLinkExpired;
