import Button, { Size, Variant } from 'components/Button';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import React, { useState } from 'react';
import Report from './Report';

type AppProps = {
  open: boolean;
  closeModal: () => any;
  data: Record<string, any>;
  importId: string;
};

const Details: React.FC<AppProps> = ({ open, closeModal, data, importId }) => {
  const [status, setStatus] = useState('');

  const info = data?.result?.data?.info || {};

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
              <span className="w-9">{info?.total}</span>
              <span
                className="font-semibold cursor-pointer text-neutral-500"
                onClick={() => {
                  setStatus('ATTEMPTED');
                }}
              >
                view details
              </span>
            </div>
            <div className="flex w-full items-center gap-2">
              <span className="w-9 text-primary-500">{info?.valid}</span>
              <span
                className="font-semibold cursor-pointer text-neutral-500"
                onClick={() => {
                  setStatus('CREATED');
                }}
              >
                view details
              </span>
            </div>
            <div className="flex w-full items-center gap-2">
              <span className="w-9 text-yellow-300">
                {info?.addedWithMissingValues}
              </span>
              <span
                className="font-semibold cursor-pointer text-neutral-500"
                onClick={() => {
                  setStatus('PARTIAL');
                }}
              >
                view details
              </span>
            </div>
            <div className="flex w-full items-center gap-2">
              <span className="w-9 text-red-500">{info?.error}</span>
              <span
                className="font-semibold cursor-pointer text-neutral-500"
                onClick={() => {
                  setStatus('FAILED');
                }}
              >
                view details
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
          title="Members with"
          closeBtnDataTestId="import-people-close"
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
          <div>
            <Icon name="download" />
            <div>export report</div>
          </div>
          <Button
            label="Cancel"
            variant={Variant.Secondary}
            size={Size.Small}
            className="mr-4"
            onClick={closeModal}
            dataTestId="mport-people-cancel"
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
