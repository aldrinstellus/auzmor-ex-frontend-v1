import React from 'react';
import Modal from '../Modal';

export interface IUserInviteProps {}

const UserInvite: React.FC<IUserInviteProps> = () => {
  return (
    <div>
      <Modal
        open={false}
        closeModal={() => {}}
        title={''}
        body={undefined}
        footer={undefined}
      />
    </div>
  );
};

export default UserInvite;
