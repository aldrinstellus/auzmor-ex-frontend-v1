import React from 'react';
import Modal from './Modal';

export interface IUserInviteProps {}

const UserInvite: React.FC<IUserInviteProps> = () => {
  return (
    <div>
      <Modal
        open={false}
        setOpen={function (show: boolean): void {
          throw new Error('Function not implemented.');
        }}
        title={''}
        body={undefined}
        footer={undefined}
      />
    </div>
  );
};

export default UserInvite;
