import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import Button, { Variant as ButtonVariant } from 'components/Button';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import ConfirmationBox from 'components/ConfirmationBox';
import AddTeams from './AddTeams';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ICreateTeams, createTeams } from 'queries/users';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import { twConfig } from 'utils/misc';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export interface ITeamForm {
  name: string;
  category: Record<string, any>;
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

  const schema = yup.object({
    name: yup.string().required('Please enter team name'),
    category: yup.object().required('Please select team category'),
    description: yup.string().required('please enter role'),
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<ITeamForm>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {},
  });

  useEffect(() => {
    if (!open) reset();
  }, [open]);

  const onSubmit = (data: ITeamForm) => {
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
          title="Add new team"
          onClose={() => closeModal()}
          closeBtnDataTestId="invite-people-close"
        />
        <AddTeams control={control} errors={errors} />
        <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
          <Button
            label="Cancel"
            variant={ButtonVariant.Secondary}
            disabled={false}
            className="mr-4"
            onClick={() => closeModal()}
            dataTestId=""
          />
          <Button
            label="Create"
            onClick={handleSubmit(onSubmit)}
            loading={createTeamMutation?.isLoading}
            dataTestId=""
          />
        </div>
      </Modal>
    </>
  );
};

export default AddTeamModal;
