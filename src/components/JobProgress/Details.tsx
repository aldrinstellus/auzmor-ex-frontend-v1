import Button, { Variant } from 'components/Button';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import React from 'react';

type AppProps = {
  open: boolean;
  closeModal: () => any;
  data: Record<string, any>;
};

const Details: React.FC<AppProps> = ({ open, closeModal, data }) => {
  return (
    <Modal open={open}>
      <Header onClose={closeModal} title="Enrolled Users-Details" />
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
              <span className="w-9">{data?.info?.total}</span>
              <span className="font-semibold cursor-pointer text-neutral-500">
                view details
              </span>
            </div>
            <div className="flex w-full items-center gap-2">
              <span className="w-9 text-primary-500">{data?.info?.valid}</span>
              <span className="font-semibold cursor-pointer text-neutral-500">
                view details
              </span>
            </div>
            <div className="flex w-full items-center gap-2">
              <span className="w-9 text-yellow-300">
                {data?.info?.addedWithMissingValues}
              </span>
              <span className="font-semibold cursor-pointer text-neutral-500">
                view details
              </span>
            </div>
            <div className="flex w-full items-center gap-2">
              <span className="w-9 text-red-500">{data?.info?.error}</span>
              <span className="font-semibold cursor-pointer text-neutral-500">
                view details
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
        <Button
          label="Close"
          variant={Variant.Secondary}
          onClick={closeModal}
          dataTestId=""
        />
      </div>
    </Modal>
  );
};

export default Details;
