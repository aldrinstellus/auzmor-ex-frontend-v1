import Button, { Size, Variant } from 'components/Button';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import React, { useState } from 'react';
import Report from './Report';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { twConfig } from 'utils/misc';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { downloadReport } from 'queries/importUsers';
import Spinner from 'components/Spinner';

type AppProps = {
  open: boolean;
  closeModal: () => any;
  data: Record<string, any>;
  importId: string;
};

const mapStatusLabel: Record<string, string> = {
  CREATED: 'Successful Invites',
  PARTIAL: 'Partial Invites',
  ATTEMPTED: 'Attempted Invites',
  FAILED: 'Failed Invites',
  SKIPPED: 'Ignored Invites',
};

const Details: React.FC<AppProps> = ({ open, closeModal, data, importId }) => {
  const [status, setStatus] = useState('');

  const info = data?.result?.data?.info || {};

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
      toast(
        <SuccessToast
          content={'Report exported successfully'}
          dataTestId="acknowledgement-report-export-toast-message"
        />,
        {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              color="text-primary-500"
              size={20}
            />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.primary['300']}`,
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
  });

  const renderSummary = () => {
    return (
      <div className="flex flex-col p-6 w-full gap-4 items-center">
        <Icon name="cloudAdd" size={120} color="text-primary-500" disabled />
        <p className="font-semibold text-xl text-neutral-900">
          Members have been successfully uploaded to Auzmor
        </p>
        <Divider />
        <div className="flex w-full text-neutral-900 font-bold text-sm">
          <div className="w-1/2 flex flex-col gap-6">Member details</div>
          <div className="w-1/2 pl-6 flex flex-col gap-6">
            Number of members
          </div>
        </div>
        <div className="flex w-full text-sm text-neutral-900">
          <div className="w-1/2 flex flex-col gap-6">
            <div>Members attempted</div>
            <div>Members added successfully</div>
            <div>Members added with missing values</div>
            <div>Members skipped due to errors</div>
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
                View details
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
                View details
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
                View details
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
                View details
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
          onBackIconClick={() => setStatus('')}
          title={mapStatusLabel[status]}
          closeBtnDataTestId="import-people-close"
          titleDataTestId="modal-header"
        />
      ) : (
        <Header onClose={closeModal} title="Enrolled Users-Details" />
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
              <Icon name="download" size={16} className="text-primary-500" />
            )}
            <div className="text-xs">export report</div>
          </div>
          <Button
            label="Back"
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
            label="Close"
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
