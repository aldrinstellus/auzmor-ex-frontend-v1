import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import Button, { Variant as ButtonVariant } from 'components/Button';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import ConfirmationBox from 'components/ConfirmationBox';
import AddTeams from './AddTeams';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTeams, updateTeam } from 'queries/users';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import { twConfig } from 'utils/misc';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FailureToast from 'components/Toast/variants/FailureToast';
import Icon from 'components/Icon';
import { ITeamCategory, ITeamDetails, TeamFlow } from '../Teams';

export interface ITeamForm {
  name: string;
  category: ITeamCategory | string;
  description: string;
}

export interface IAddTeamModalProps {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const AddTeamModal: React.FC<IAddTeamModalProps> = ({
  open,
  openModal,
  closeModal,
}) => {
  const queryClient = useQueryClient();

  const schema = yup.object({
    name: yup.string().required('Please enter team name'),
    category: yup.object().required('Please select team category'),
    description: yup.string().required('please enter role'),
  });

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isValid },
  } = useForm<ITeamForm>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const createTeamMutation = useMutation({
    mutationKey: ['create-teams'],
    mutationFn: createTeams,
    onError: () => {},
    onSuccess: (data: any) => {
      queryClient.invalidateQueries(['teams']);
      toast(<SuccessToast content={'Team Created Successfully'} />, {
        style: {
          border: `1px solid ${twConfig.theme.colors.primary['300']}`,
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
        },
        autoClose: TOAST_AUTOCLOSE_TIME,
        transition: slideInAndOutTop,
        theme: 'dark',
      });
      closeModal();
    },
  });

  // const updateTeamMutation = useMutation({
  //   mutationKey: ['update-team', teamId],
  //   mutationFn: (payload: any) => {
  //     return updateTeam(teamId || '', payload);
  //   },
  //   onError: () => {
  //     toast(
  //       <FailureToast
  //         content={`Error Updating Team`}
  //         dataTestId="team-update-error-toaster"
  //       />,
  //       {
  //         closeButton: (
  //           <Icon
  //             name="closeCircleOutline"
  //             stroke={twConfig.theme.colors.red['500']}
  //             size={20}
  //           />
  //         ),
  //         style: {
  //           border: `1px solid ${twConfig.theme.colors.red['300']}`,
  //           borderRadius: '6px',
  //           display: 'flex',
  //           alignItems: 'center',
  //         },
  //         autoClose: TOAST_AUTOCLOSE_TIME,
  //         transition: slideInAndOutTop,
  //         theme: 'dark',
  //       },
  //     );
  //   },
  //   onSuccess: () => {
  //     toast(
  //       <SuccessToast
  //         content={`Team has been updated`}
  //         dataTestId="team-updated-success-toaster"
  //       />,
  //       {
  //         closeButton: (
  //           <Icon
  //             name="closeCircleOutline"
  //             stroke={twConfig.theme.colors.primary['500']}
  //             size={20}
  //           />
  //         ),
  //         style: {
  //           border: `1px solid ${twConfig.theme.colors.primary['300']}`,
  //           borderRadius: '6px',
  //           display: 'flex',
  //           alignItems: 'center',
  //         },
  //         autoClose: TOAST_AUTOCLOSE_TIME,
  //         transition: slideInAndOutTop,
  //         theme: 'dark',
  //       },
  //     );
  //   },
  // });

  useEffect(() => {
    if (!open) reset();
  }, [open]);

  const onSubmit = (data: any) => {
    const payload = {
      name: data?.name,
      category: data?.category?.value,
      description: data?.description,
    };
    createTeamMutation.mutate(payload);
  };

  return (
    <>
      <Modal open={open} className="max-w-[638px]">
        <Header
          title="Add new Team"
          onClose={() => closeModal()}
          closeBtnDataTestId="invite-people-close"
        />
        <AddTeams control={control} errors={errors} />
        <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
          <Button
            label="Back"
            variant={ButtonVariant.Secondary}
            disabled={false}
            className="mr-4"
            onClick={() => closeModal()}
            dataTestId="add-team-back"
          />
          <Button
            label="Create"
            onClick={handleSubmit(onSubmit)}
            loading={createTeamMutation?.isLoading}
            dataTestId="create-team-cta"
          />
        </div>
      </Modal>
    </>
  );
};

export default AddTeamModal;
