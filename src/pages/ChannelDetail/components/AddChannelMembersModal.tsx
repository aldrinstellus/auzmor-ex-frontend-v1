import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import { FC, useEffect, useState } from 'react';
import EntitySearchModalBody from 'components/EntitySearchModal/components/EntitySearchModalBody';
import { useForm } from 'react-hook-form';
import { useEntitySearchFormStore } from 'stores/entitySearchFormStore';
import {
  EntitySearchModalType,
  IAudienceForm,
  IChannelMembersField,
} from 'components/EntitySearchModal';
import Button, { Variant as ButtonVariant } from 'components/Button';
import { CHANNEL_ROLE, IChannel } from 'stores/channelStore';
import {
  IChannelMembersPayload,
  addChannelMembers,
  useChannelMembersStatus,
} from 'queries/channel';
import { useMutation } from '@tanstack/react-query';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import queryClient from 'utils/queryClient';
import { useTranslation } from 'react-i18next';
import { useInfiniteMembers } from 'queries/users';

interface IAddChannelMembersModalProps {
  open: boolean;
  closeModal: () => void;
  channelData: IChannel;
}

const AddChannelMembersModal: FC<IAddChannelMembersModalProps> = ({
  open,
  closeModal,
  channelData,
}) => {
  const { t } = useTranslation('channelDetail');
  const [jobId, setJobId] = useState('');

  const audienceForm = useForm<IAudienceForm>({
    defaultValues: {
      showSelectedMembers: false,
      selectAll: false,
    },
  });

  const { form, setForm } = useEntitySearchFormStore();
  const channelMembers = form?.watch('channelMembers');

  useEffect(() => {
    setForm(audienceForm);
    return () => setForm(null);
  }, []);

  const addChannelMembersMutation = useMutation({
    mutationKey: ['add-channel-members', channelData.id],
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: IChannelMembersPayload;
    }) => addChannelMembers(id, payload),
    onError: () => {
      failureToastConfig({
        content: t('addChannelMembers.failure'),
      });
    },
    onSuccess: (data) => {
      const jobId = data?.result?.data?.id || '';
      if (jobId) setJobId(jobId);
    },
  });

  useChannelMembersStatus({
    channelId: channelData.id,
    jobId,
    onSuccess: (data: any) => {
      console.log('Successfully fetched bulk job status', data);
      const status = data?.data?.result?.data?.status;
      if (status === 'COMPLETED') {
        setJobId('');
        queryClient.invalidateQueries({ queryKey: ['channel-members'] });
        queryClient.invalidateQueries({ queryKey: ['channel'] });
        queryClient.invalidateQueries({ queryKey: ['search-team-members'] });
        successToastConfig({
          content: t('addChannelMembers.success'),
        });
        closeModal();
      }
    },
    onError: () => {
      console.log('Failed to fetch status for jobId: ', jobId);
      failureToastConfig({
        content: t('addChannelMembersStatus.failure'),
      });
      setJobId('');
    },
  });

  function handleSubmit(data: IChannelMembersField): void {
    const selectedUsers = Object.keys(data?.users || {})
      .map((key) => data.users?.[key])
      .filter((item) => item && item.user)
      .map((item) => ({
        id: item?.user?.id || '',
        role: item?.role || CHANNEL_ROLE.Member,
      }));
    const selectedTeams = Object.keys(data?.teams || {})
      .map((key) => data.teams?.[key])
      .filter((item) => item && item.team)
      .map((item) => ({
        id: item?.team?.id || '',
        role: item?.role || CHANNEL_ROLE.Member,
      }));

    const payload: IChannelMembersPayload = {};
    if (selectedUsers && selectedUsers.length) payload.users = selectedUsers;
    if (selectedTeams && selectedTeams.length) payload.teams = selectedTeams;
    addChannelMembersMutation.mutate({ id: channelData.id, payload });
  }

  const dataTestId = 'add-members';
  const isLoading = addChannelMembersMutation.isLoading || !!jobId;

  const selectedUsers = Object.keys(channelMembers?.users || {})
    .map((key) => channelMembers?.users?.[key])
    .filter((item) => item && item.user);
  const selectedTeams = Object.keys(channelMembers?.teams || {})
    .map((key) => channelMembers?.teams?.[key])
    .filter((item) => item && item.team);

  return form ? (
    <Modal open={open} className="max-w-[638px]">
      <form onSubmit={(e) => e.preventDefault()}>
        <Header
          title={
            <span>
              Add members{' '}
              <span className="text-primary-500">@{channelData?.name}</span>
            </span>
          }
          closeBtnDataTestId={`${dataTestId}-close`}
          onClose={closeModal}
        />
        <EntitySearchModalBody
          entityType={EntitySearchModalType.ChannelMembers}
          fetchUsers={useInfiniteMembers}
          usersQueryParams={{ entityType: 'CHANNEL', entityId: channelData.id }}
          dataTestId={dataTestId}
        />
        <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-19xl">
          <div className="flex">
            <Button
              variant={ButtonVariant.Secondary}
              label="Cancel"
              disabled={isLoading}
              className="mr-3"
              onClick={closeModal}
              dataTestId={`${dataTestId}-cancel}`}
            />
            <Button
              label="Enroll Members"
              loading={isLoading}
              dataTestId={`${dataTestId}-cta`}
              disabled={!!!(selectedUsers.length + selectedTeams.length)}
              onClick={form.handleSubmit((formData) => {
                handleSubmit(formData.channelMembers);
              })}
            />
          </div>
        </div>
      </form>
    </Modal>
  ) : (
    <></>
  );
};

export default AddChannelMembersModal;
