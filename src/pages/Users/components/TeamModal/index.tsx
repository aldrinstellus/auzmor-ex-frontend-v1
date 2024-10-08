import * as yup from 'yup';
import Button, { Variant as ButtonVariant } from 'components/Button';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import AddTeams from './AddTeams';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { TeamFlow } from '../Teams';
import { FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useNavigate from 'hooks/useNavigation';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';

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
  const { t } = useTranslation('profile', { keyPrefix: 'teamModal' });
  const { getApi } = usePermissions();

  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const schema = yup.object({
    name: yup.string().required(t('validation.nameRequired')),
    category: yup.object().required(t('validation.categoryRequired')),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
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

  const createTeam = getApi(ApiEnum.CreateTeam);
  const createTeamMutation = useMutation({
    mutationKey: ['create-teams'],
    mutationFn: (payload: {
      name: string;
      category: string;
      description: string;
    }) => createTeam(payload),
    onError: (error: any) => {
      if (error?.response?.data?.errors?.length) {
        setError('name', {
          type: 'custom',
          message: error?.response?.data?.errors[0]?.message,
        });
      }
      failureToastConfig({
        content: t('toast.createError'),
        dataTestId: 'team-create-error-toaster',
      });
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries(['teams']);
      successToastConfig({ content: t('toast.createSuccess') });
      closeModal();
      navigate(`/teams/${data.result.id}?addMembers=true`, {
        state: { prevRoute: searchParams.get('tab') },
      });
      queryClient.invalidateQueries(['categories']);
    },
  });

  const updateTeam = getApi(ApiEnum.UpdateTeam);
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
      failureToastConfig({
        content: t('toast.updateError'),
        dataTestId: 'team-update-error-toaster',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['teams']);
      queryClient.invalidateQueries(['team', team?.id]);
      successToastConfig({
        content: t('toast.updateSuccess'),
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
          title={t(
            teamFlowMode === TeamFlow.CreateTeam
              ? 'title.create'
              : 'title.edit',
          )}
          onClose={onCloseReset}
          closeBtnDataTestId="add-team-close"
        />
        <AddTeams control={control} errors={errors} defaultValues={getValues} />
        <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
          <Button
            label={t('button.back')}
            variant={ButtonVariant.Secondary}
            disabled={false}
            className="mr-4"
            onClick={onCloseReset}
            dataTestId="add-team-back"
          />
          <Button
            label={t(
              teamFlowMode === TeamFlow.CreateTeam
                ? 'button.create'
                : 'button.update',
            )}
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
