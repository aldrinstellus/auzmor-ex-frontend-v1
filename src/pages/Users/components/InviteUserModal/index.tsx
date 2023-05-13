import Button, { Variant as ButtonVariant } from 'components/Button';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import AddUsers from './AddUsers';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import {
  IPostUser,
  IPostUsersResponse,
  UserStatus,
  inviteUsers,
} from 'queries/users';
import ConfirmationBox from 'components/ConfirmationBox';
import { toast } from 'react-toastify';
import Icon from 'components/Icon';
import { twConfig } from 'utils/misc';
import InvitedUsersList from './InvitedUsersList';

export interface IInviteUserModalProps {
  showModal: boolean;
  closeModal: () => void;
  setShowAddUserModal: (flag: boolean) => void;
}

export interface IRoleOption {
  value: string;
  label: string;
}

export const roleOptions: IRoleOption[] = [
  { value: 'MEMBER', label: 'Member' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'SUPERADMIN', label: 'SuperAdmin' },
];

export interface IUserForm {
  members: { fullName: string; workEmail: string; role: IRoleOption }[];
}

const InviteUserModal: React.FC<IInviteUserModalProps> = ({
  showModal,
  closeModal,
  setShowAddUserModal,
}) => {
  const [showInvitedMembers, setShowInvitedMembers] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [invitedUsersResponse, setInvitedUsersResponse] = useState<
    IPostUsersResponse[]
  >([]);
  const inviteUsersMutation = useMutation({
    mutationKey: ['inviteUsersMutation'],
    mutationFn: inviteUsers,
    onError: (error) => {
      setShowConfirmationModal(true);
    },
    onSuccess: (data: any) => {
      setInvitedUsersResponse(data.result.data);
      let invitedCount = 0;
      data.result.data.forEach(
        (eachMember: IPostUsersResponse) =>
          eachMember.status === UserStatus.Invited && ++invitedCount,
      );
      const toastString =
        invitedCount === data.result.data.length
          ? `All ${invitedCount} users were invited successfully`
          : `${invitedCount} out of the ${data.result.data.length} users were invited successfully `;
      toast(
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div>
              <Icon
                className="p-1.5 bg-primary-100 rounded-7xl mr-2.5"
                name="tickCircleOutline"
                stroke={twConfig.theme.colors.primary['500']}
              />
            </div>
            <span className="text-primary-500 text-sm w-56">{toastString}</span>
          </div>
          <div className="flex">
            <Button
              className="text-primary-500 ml-4 pr-1"
              variant={ButtonVariant.Tertiary}
              label="Show details"
              onClick={() => {
                setShowAddUserModal(true);
                setShowInvitedMembers(true);
              }}
            />
          </div>
        </div>,
        {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              stroke={twConfig.theme.colors.primary['500']}
              size={20}
            />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.primary['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          },
        },
      );
      setShowAddUserModal(false);
    },
  });
  const schema = yup.object({
    members: yup.array().of(
      yup.object().shape({
        fullName: yup.string().required('Please enter name'),
        workEmail: yup
          .string()
          .email('Please enter valid email address')
          .required('Please enter Email'),
        role: yup.object().required('please enter role'),
      }),
    ),
  });
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IUserForm>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      members: [{ fullName: '', workEmail: '', role: roleOptions[0] }],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: 'members',
  });

  const onSubmit = (data: IUserForm) => {
    const payload: IPostUser[] = data.members.map((member) => ({
      ...member,
      role: member.role.value,
    }));
    inviteUsersMutation.mutate({ users: payload });
  };

  const close = () => {
    closeModal();
    reset();
  };

  return (
    <>
      <Modal open={showModal} closeModal={close}>
        {/*---------- {<>Header</>} ----------*/}
        <Header
          title={
            showInvitedMembers
              ? 'Invited Users - Details'
              : 'Invite new people to your organization'
          }
          onClose={close}
        />

        {/*---------- {<>Body</>} ----------*/}
        {showInvitedMembers ? (
          <InvitedUsersList invitedUsersResponse={invitedUsersResponse} />
        ) : (
          <AddUsers
            fields={fields}
            appendMembers={append}
            control={control}
            errors={errors}
          />
        )}

        {/*---------- {<>Footer</>} ---------*/}
        <div className="flex justify-end items-center h-16 p-6 bg-blue-50">
          <Button
            label="Cancle"
            variant={ButtonVariant.Secondary}
            disabled={false}
            className="mr-4"
            onClick={close}
          />
          {showInvitedMembers ? (
            <Button
              label="Retry"
              onClick={() => {
                setShowInvitedMembers(false);
              }}
            />
          ) : (
            <Button label="Send Invite" onClick={handleSubmit(onSubmit)} />
          )}
        </div>
      </Modal>
      <ConfirmationBox
        open={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        title="Error!"
        description={
          <span>
            Failed to add participant. Email not recognised.
            <br /> Please enter valid details.
          </span>
        }
        success={{
          label: 'Try Again',
          className: 'bg-primary-500 text-white ',
          onSubmit: () => {
            setShowConfirmationModal(false);
            reset();
            setShowAddUserModal(true);
          },
        }}
        discard={{
          label: 'cancel',
          className: 'text-neutral-900 bg-white ',
          onCancel: () => {
            setShowConfirmationModal(false);
          },
        }}
      />
    </>
  );
};

export default InviteUserModal;
