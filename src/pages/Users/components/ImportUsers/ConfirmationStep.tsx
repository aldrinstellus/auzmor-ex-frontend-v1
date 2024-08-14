/* eslint-disable @typescript-eslint/no-unused-vars */
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import React from 'react';
import { StepEnum } from './utils';
import Button, { Size, Variant } from 'components/Button';
import { useMutation } from '@tanstack/react-query';
import { startCreatingUsers } from 'queries/importUsers';
import { useJobStore } from 'stores/jobStore';
import apiService from 'utils/apiService';
import { useTranslation } from 'react-i18next';

type AppProps = {
  closeModal: () => any;
  importId: string;
  open: boolean;
};

const ConfirmationStep: React.FC<AppProps> = ({
  importId,
  open,
  closeModal,
}) => {
  const { setShowJobProgress, setImportId, setTotal, setStep } = useJobStore();

  const { t } = useTranslation('profile', {
    keyPrefix: 'importUser.confirmationStep',
  });
  const startCreatingUserMutation = useMutation(
    () => startCreatingUsers(importId),
    {
      onError: () => {},
      onSuccess: async (res: any) => {
        closeModal();
        setImportId(importId);
        const { data } = await apiService.get(
          `/users/import/${importId}/validate`,
        );
        setTotal(data.result.totalCount);
        setShowJobProgress(true);
      },
    },
  );

  return (
    <Modal open={open} className="max-w-md">
      <Header
        title={t('confirmation')}
        onClose={() => setStep(StepEnum.Review)}
        closeBtnDataTestId="import-people-close"
      />
      <div className="p-6 flex justify-center items-center text-sm text-neutral-900">
        {t('proceedConfirmation')}
      </div>
      <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
        <Button
          label={t('reviewModule')}
          variant={Variant.Secondary}
          size={Size.Small}
          className="mr-4"
          onClick={() => setStep(StepEnum.Review)}
          dataTestId="review-module-cta"
          disabled={startCreatingUserMutation.isLoading}
        />
        <Button
          label={t('confirm')}
          size={Size.Small}
          dataTestId="complete-cta"
          loading={startCreatingUserMutation.isLoading}
          onClick={() => startCreatingUserMutation.mutate()}
        />
      </div>
    </Modal>
  );
};

export default ConfirmationStep;
