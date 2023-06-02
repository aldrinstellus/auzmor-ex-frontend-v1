import Button, { Variant as ButtonVariant } from 'components/Button';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import AddUsers from './AddUsers';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import { EMAIL_REGX } from 'utils/constants';
import SuccessToast from 'components/Toast/variants/SuccessToast';

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

export interface IEmailValidationErrors {
  [index: number]: { isError: boolean; isLoading: boolean };
}

const InviteUserModal: React.FC<IInviteUserModalProps> = ({
  showModal,
  closeModal,
  setShowAddUserModal,
}) => {
  const queryClient = useQueryClient();
  const [showInvitedMembers, setShowInvitedMembers] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [invitedUsersResponse, setInvitedUsersResponse] = useState<
    IPostUsersResponse[]
  >([]);
  const [emailValidationErrors, setErrorValidationErrors] =
    useState<IEmailValidationErrors | null>(null);

  const isEmailValid = () => {
    if (emailValidationErrors) {
      let error = true;
      Object.keys(emailValidationErrors).forEach((key: string) => {
        if (
          emailValidationErrors[parseInt(key)].isError ||
          emailValidationErrors[parseInt(key)].isLoading
        ) {
          error = false;
          return;
        }
      });
      return error;
    } else return true;
  };

  const getToastMessage = (users: IPostUsersResponse[]) => {
    close();
    if (users.length === 1) {
      return (
        <span data-testId="added-people-toaster">
          <span className="font-bold">{users[0].fullName}</span> added to your
          organization successfully
        </span>
      );
    } else if (users.length === 2) {
      return (
        <span data-testId="added-people-toaster">
          <span className="font-bold">{users[0].fullName}, </span>
          <span className="font-bold">{users[1].fullName}</span> added to your
          organization successfully
        </span>
      );
    } else if (users.length > 2) {
      return (
        <span data-testId="added-people-toaster">
          <span className="font-bold">{users[0].fullName}, </span>
          <span className="font-bold">{users[1].fullName}, </span>{' '}
          <span className="font-bold">+{users.length - 2} others</span> added to
          your organization successfully
        </span>
      );
    }
  };

  const inviteUsersMutation = useMutation({
    mutationKey: ['inviteUsersMutation'],
    mutationFn: inviteUsers,
    onError: (error) => {
      setShowConfirmationModal(true);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries(['users']);
      setInvitedUsersResponse(data.result.data);
      let invitedCount = 0;
      data.result.data.forEach(
        (eachMember: IPostUsersResponse) =>
          eachMember.status === UserStatus.Invited && ++invitedCount,
      );

      const toastString =
        invitedCount === data.result.data.length
          ? getToastMessage(data.result.data)
          : `${invitedCount} out of the ${data.result.data.length} users were invited successfully `;

      toast(
        <SuccessToast
          content={toastString}
          actionLabel={
            invitedCount !== data.result.data.length ? 'Show details' : ''
          }
          action={() => {
            setShowAddUserModal(true);
            setShowInvitedMembers(true);
          }}
        />,
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
        fullName: yup.string().required('Please enter Name'),
        workEmail: yup
          .string()
          .required('Please enter Email')
          .matches(new RegExp(EMAIL_REGX), 'Please enter valid email address'),
        role: yup.object().required('please enter role'),
      }),
    ),
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<IUserForm>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      members: [{ fullName: '', workEmail: '', role: roleOptions[0] }],
    },
  });

  const { fields, append, remove } = useFieldArray({
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
    setInvitedUsersResponse([]);
    setShowInvitedMembers(false);
    remove();
    append({ fullName: '', workEmail: '', role: roleOptions[0] });
  };

  return (
    <>
      <Modal open={showModal} closeModal={close} className="max-w-3xl">
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
            remove={remove}
            watch={watch}
            emailValidationErrors={emailValidationErrors}
            setErrorValidationErrors={setErrorValidationErrors}
          />
        )}

        {/*---------- {<>Footer</>} ---------*/}
        <div className="flex justify-end items-center h-16 p-6 bg-blue-50">
          <Button
            label="Cancel"
            variant={ButtonVariant.Secondary}
            disabled={inviteUsersMutation.isLoading}
            className="mr-4"
            onClick={close}
            dataTestId="invite-people-cancel"
          />
          {showInvitedMembers ? (
            <Button
              label="Retry"
              onClick={() => {
                setShowInvitedMembers(false);
                remove();
                invitedUsersResponse
                  .filter(
                    (user) =>
                      user.status === UserStatus.Failed ||
                      user.status === UserStatus.Created,
                  )
                  .forEach((user: IPostUsersResponse) => {
                    append({
                      fullName: user.fullName,
                      workEmail: user.workEmail,
                      role: roleOptions.find(
                        (role) => user.role === role.value,
                      )!,
                    });
                  });
              }}
            />
          ) : (
            <Button
              label="Send Invite"
              onClick={handleSubmit(onSubmit)}
              disabled={
                inviteUsersMutation.isLoading || !isValid || !isEmailValid()
              }
              loading={inviteUsersMutation.isLoading}
              dataTestId="invite-people-send-invite"
            />
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
