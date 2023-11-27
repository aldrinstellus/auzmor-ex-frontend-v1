import Button, { Variant } from 'components/Button';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import { Check } from 'components/Logo';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import useModal from 'hooks/useModal';
import { FC } from 'react';
import { useJobStore } from 'stores/jobStore';

export const JobProgress: FC = () => {
  const { progress, heading, content, setShowJobProgress } = useJobStore();
  const [open, openCollpase, closeCollapse] = useModal(true);
  return (
    <div className="fixed w-full bottom-0 flex justify-center px-14 z-50">
      <div className="w-[1440px] flex flex-row-reverse">
        {content ? (
          <div
            className={`px-4 py-3 bg-neutral-900 rounded-t-9xl border border-neutral-300 w-[600px] transition-all duration-300 ease-in-out font-medium text-base text-white origin-top scale-y-100`}
          >
            {content}
          </div>
        ) : (
          <div
            className={`${
              open ? 'h-[74px]' : 'h-[50px]'
            } px-4 py-3 bg-neutral-900 rounded-t-9xl border border-neutral-300 w-[600px] transition-all duration-300 ease-in-out font-medium text-base text-white origin-top scale-y-100`}
          >
            <div className="flex justify-between items-center">
              <p>{heading}</p>
              <div className="flex gap-2 items-center">
                <Icon
                  name={!open ? 'arrowUp' : 'arrowDown'}
                  onClick={open ? closeCollapse : openCollpase}
                  hoverColor="text-white"
                  color="!text-white"
                  size={24}
                />
                <Icon
                  name="close"
                  onClick={() => setShowJobProgress(false)}
                  hoverColor="text-white"
                  color="!text-white"
                  size={20}
                />
              </div>
            </div>
            <div
              className={`${
                open ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-300 ease-in-out flex items-center gap-4`}
            >
              <div>{progress}%</div>
              <div className="w-full rounded-[100px] bg-neutral-400 h-[5px] relative">
                <div
                  className={`h-full rounded-[100px] bg-primary-500`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export interface IUploadProgressTemplateProps {
  text?: string;
  btnLabel?: string;
  onBtnClick?: () => void;
  onClose?: () => void;
}

export const ProgressTemplateViewDetails: FC<IUploadProgressTemplateProps> = ({
  text = 'All members are added successfully',
  btnLabel = 'View details',
  onBtnClick = () => {},
  onClose = () => {},
}) => {
  const [open, openModal, closeModal] = useModal(false);
  return (
    <>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
            <Check className="w-4 h-4" />
          </div>
          <p>{text}</p>
        </div>
        <div className="flex items-center gap-2">
          <p
            className="cursor-pointer"
            onClick={() => {
              onBtnClick();
              openModal();
            }}
          >
            {btnLabel}
          </p>
          <Icon
            name="close"
            hoverColor="text-white"
            color="!text-white"
            size={20}
            onClick={onClose}
          />
        </div>
      </div>
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
                <span className="w-9">32</span>
                <span className="font-semibold cursor-pointer text-neutral-500">
                  view details
                </span>
              </div>
              <div className="flex w-full items-center gap-2">
                <span className="w-9 text-primary-500">30</span>
                <span className="font-semibold cursor-pointer text-neutral-500">
                  view details
                </span>
              </div>
              <div className="flex w-full items-center gap-2">
                <span className="w-9 text-yellow-300">2</span>
                <span className="font-semibold cursor-pointer text-neutral-500">
                  view details
                </span>
              </div>
              <div className="flex w-full items-center gap-2">
                <span className="w-9 text-red-500">0</span>
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
    </>
  );
};
