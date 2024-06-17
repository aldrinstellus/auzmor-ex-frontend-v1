import * as yup from 'yup';
import Button, { Variant as ButtonVariant } from 'components/Button';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import AddTeams from './AddTeams';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTeams, updateTeam } from 'queries/teams';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import { twConfig } from 'utils/misc';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FailureToast from 'components/Toast/variants/FailureToast';
import Icon from 'components/Icon';
import { TeamFlow } from '../Teams';
import { FC } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export interface ITeamForm {
  name: string;
  category: Record<string, any> | null;
  description: string;
}

export interface IAddTeamModalProps {
  open: boolean;
  closeModal: () => void;
  teamFlowMode: string;
  setTeamFlow: any;
  team: Record<string, any> | any;
}

const TeamModal: FC<IAddTeamModalProps> = ({
  open,
  closeModal,
  teamFlowMode,
  setTeamFlow,
  team,
}) => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const schema = yup.object({
    name: yup.string().required('Please enter team name'),
    category: yup.object().required('Please select team category'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    // reset,
    // resetField,
    getValues,
    setError,
  } = useForm<ITeamForm>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: team?.name || '',
      category: team?.category?.categoryId
        ? {
            label: team?.category?.name,
            value: team?.category?.name,
          }
        : null,
      description: team?.description || '',
    },
  });

  const createTeamMutation = useMutation({
    mutationKey: ['create-teams'],
    mutationFn: createTeams,
    onError: (error: any) => {
      if (error?.response?.data?.errors?.length) {
        setError('name', {
          type: 'custom',
          message: error?.response?.data?.errors[0]?.message,
        });
      }
      toast(
        <FailureToast
          content={`Error Creating Team`}
          dataTestId="team-create-error-toaster"
        />,
        {
          closeButton: (
            <Icon name="closeCircleOutline" color="text-red-500" size={20} />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.red['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
          theme: 'dark',
        },
      );
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries(['teams']);
      successToastConfig({ message: 'Team Created Successfully' });
      closeModal();
      navigate(`/teams/${data.result.id}?addMembers=true`, {
        state: { prevRoute: searchParams.get('tab') },
      });
      queryClient.invalidateQueries(['categories']);
    },
  });

  const updateTeamMutation = useMutation({
    mutationKey: ['update-team', team?.id],
    mutationFn: (payload: any) => {
      return updateTeam(team?.id || '', payload);
    },
    onError: (error: any) => {
      if (error?.response?.data?.errors?.length) {
        setError('name', {
          type: 'custom',
          message: error?.response?.data?.errors[0]?.message,
        });
      }
      toast(
        <FailureToast
          content={`Error Updating Team`}
          dataTestId="team-update-error-toaster"
        />,
        {
          closeButton: (
            <Icon name="closeCircleOutline" color="text-red-500" size={20} />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.red['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
          theme: 'dark',
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['teams']);
      queryClient.invalidateQueries(['team', team?.id]);
      successToastConfig({
        message: `Team has been updated`,
        dataTestId: 'team-updated-success-toaster',
      });
      closeModal();
      queryClient.invalidateQueries(['categories']);
    },
  });

  const onSubmit = (data: any) => {
    const payload = {
      name: data?.name,
      category: data?.category?.label,
      description: data?.description,
    };
    if (teamFlowMode === TeamFlow.CreateTeam)
      createTeamMutation.mutate(payload);
    else updateTeamMutation.mutate(payload);
  };

  const onCloseReset = () => {
    closeModal();
    if (teamFlowMode === TeamFlow.EditTeam) {
      setTeamFlow(TeamFlow.CreateTeam);
    }
  };

  return (
    <>
      <Modal open={open} className="max-w-[638px]">
        <Header
          title={`${
            teamFlowMode === TeamFlow.CreateTeam ? 'Add New' : 'Edit'
          } Team`}
          onClose={onCloseReset}
          closeBtnDataTestId="add-team-close"
        />
        <AddTeams control={control} errors={errors} defaultValues={getValues} />
        <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
          <Button
            label="Back"
            variant={ButtonVariant.Secondary}
            disabled={false}
            className="mr-4"
            onClick={onCloseReset}
            dataTestId="add-team-back"
          />
          <Button
            label={`${
              teamFlowMode === TeamFlow.CreateTeam ? 'Create' : 'Update'
            }`}
            onClick={handleSubmit(onSubmit)}
            loading={createTeamMutation?.isLoading}
            dataTestId="create-team-cta"
          />
        </div>
      </Modal>
    </>
  );
};

export default TeamModal;
