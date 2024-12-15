import Button, { Size, Variant } from 'components/Button';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import React, { useState } from 'react';
import Report from './Report';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Spinner from 'components/Spinner';
import { useTranslation } from 'react-i18next';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';

type AppProps = {
  open: boolean;
  closeModal: () => any;
  data: Record<string, any>;
  importId: string;
};

const Details: React.FC<AppProps> = ({ open, closeModal, data, importId }) => {
  const { getApi } = usePermissions();
  const { t } = useTranslation('components', {
    keyPrefix: 'jobProgress.details',
  });

  const mapStatusLabel: Record<string, string> = {
    CREATED: t('statusLabels.created'),
    PARTIAL: t('statusLabels.partial'),
    ATTEMPTED: t('statusLabels.attempted'),
    FAILED: t('statusLabels.failed'),
    SKIPPED: t('statusLabels.skipped'),
  };

  const [status, setStatus] = useState('');
  const queryClient = useQueryClient();

  const info = data?.result?.data?.info || {};

  const downloadReport = getApi(ApiEnum.DownloadImportReport);
  const exportMutation = useMutation(() => downloadReport(importId, status), {
    onError: () => {},
    onSuccess: (res: any) => {
      const blob = new Blob([res], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', 'download.csv');
      document.body.appendChild(a);
      a.click();
      successToastConfig({
        content: t('exportSuccess'),
        dataTestId: 'acknowledgement-report-export-toast-message',
      });
    },
  });

  const renderSummary = () => {
    return (
      <div className="flex flex-col p-6 w-full gap-4 items-center">
        <Icon name="cloudAdd" size={120} color="text-primary-500" disabled />
        <p className="font-semibold text-xl text-neutral-900">
          {t('uploadSuccess')}
        </p>
        <Divider />
        <div className="flex w-full text-neutral-900 font-bold text-sm">
          <div className="w-1/2 flex flex-col gap-6">{t('memberDetails')}</div>
          <div className="w-1/2 pl-6 flex flex-col gap-6">
            {t('numberOfMembers')}
          </div>
        </div>
        <div className="flex w-full text-sm text-neutral-900">
          <div className="w-1/2 flex flex-col gap-6">
            <div>{t('membersAttempted')}</div>
            <div>{t('membersAddedSuccessfully')}</div>
            <div>{t('membersAddedWithMissingValues')}</div>
            <div>{t('membersSkippedDueToErrors')}</div>
          </div>
          <div className="w-1/2 pl-6 flex flex-col gap-6">
            <div className="flex w-full items-center gap-2">
              <span className="w-9" data-testid="attempted-count">
                {info?.total}
              </span>
              <span
                className="font-semibold cursor-pointer text-neutral-500"
                onClick={() => {
                  setStatus('ATTEMPTED');
                }}
                data-testid="attempted-viewdetails"
              >
                {t('viewDetails')}
              </span>
            </div>
            <div className="flex w-full items-center gap-2">
              <span
                className="w-9 text-primary-500"
                data-testid="success-count"
              >
                {info?.valid}
              </span>
              <span
                className="font-semibold cursor-pointer text-neutral-500"
                onClick={() => {
                  setStatus('CREATED');
                }}
                data-testid="success-viewdetails"
              >
                {t('viewDetails')}
              </span>
            </div>
            <div className="flex w-full items-center gap-2">
              <span className="w-9 text-yellow-300" data-testid="missing-count">
                {info?.addedWithMissingValues}
              </span>
              <span
                className="font-semibold cursor-pointer text-neutral-500"
                onClick={() => {
                  setStatus('PARTIAL');
                }}
                data-testid="missing-viewdetails"
              >
                {t('viewDetails')}
              </span>
            </div>
            <div className="flex w-full items-center gap-2">
              <span className="w-9 text-red-500" data-testid="skipped-count">
                {info?.error}
              </span>
              <span
                className="font-semibold cursor-pointer text-neutral-500"
                onClick={() => {
                  setStatus('FAILED');
                }}
                data-testid="skipped-viewdetails"
              >
                {t('viewDetails')}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal open={open} className={status ? 'max-w-[1350px]' : 'max-w-[638px]'}>
      {status ? (
        <Header
          onBackIconClick={() => {
            queryClient.removeQueries(['csv-import', 'result']);
            setStatus('');
          }}
          title={mapStatusLabel[status]}
          closeBtnDataTestId="import-people-close"
          titleDataTestId="modal-header"
        />
      ) : (
        <Header onClose={closeModal} title={t('enrolledUsersDetails')} />
      )}
      {status ? (
        <Report importId={importId} status={status} />
      ) : (
        renderSummary()
      )}
      {status ? (
        <div className="flex justify-between items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
          <div
            className="v-center space-x-1 text-primary-500 cursor-pointer"
            onClick={() => {
              if (!exportMutation.isLoading) {
                exportMutation.mutate();
              }
            }}
            data-testid="export-report-cta"
          >
            {exportMutation.isLoading ? (
              <Spinner />
            ) : (
              <Icon name="download" size={20} className="text-primary-500" />
            )}
            <div className="text-xs font-bold">{t('exportReport')}</div>
          </div>
          <Button
            label={t('back')}
            variant={Variant.Secondary}
            size={Size.Small}
            className="mr-4"
            onClick={() => {
              setStatus('');
            }}
            dataTestId="back-cta"
          />
        </div>
      ) : (
        <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
          <Button
            label={t('close')}
            variant={Variant.Secondary}
            onClick={closeModal}
            dataTestId=""
          />
        </div>
      )}
    </Modal>
  );
};

export default Details;
