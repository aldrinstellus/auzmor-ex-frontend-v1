import clsx from 'clsx';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import Tabs from 'components/Tabs';
import React from 'react';
import Acknowledged from './Acknowledged';
import Pending from './Pending';
import { useMutation } from '@tanstack/react-query';
import { downloadAcknowledgementReport } from 'queries/post';
import { toast } from 'react-toastify';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { twConfig } from 'utils/misc';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import Spinner from 'components/Spinner';

type AppProps = {
  open: boolean;
  closeModal: () => any;
  post: Record<string, any>;
};

const AnnouncementAnalytics: React.FC<AppProps> = ({
  post,
  open,
  closeModal,
}) => {
  const tabLabel = (label: string, isActive: boolean) => {
    return <span className={clsx({ 'font-bold': isActive })}>{label}</span>;
  };

  const exportMutation = useMutation(
    () => downloadAcknowledgementReport(post.id),
    {
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
        toast(<SuccessToast content={'Report exported successfully'} />, {
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
        });
      },
    },
  );

  return (
    <Modal open={open} className="max-w-2xl">
      <div>
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <div className="font-bold text-lg text-gray-900">
            Acknowledgement report
          </div>
          <div>
            <Icon
              name="close"
              onClick={closeModal}
              dataTestId="acknowledgement-report-cancel"
            />
          </div>
        </div>
        <div className="mt-4 w-full relative">
          <Tabs
            className="w-full flex justify-start px-6"
            tabContentClassName="w-full"
            tabs={[
              {
                tabLabel: (isActive) => tabLabel('Acknowledged', isActive),
                tabContent: (
                  <Acknowledged post={post} closeModal={closeModal} />
                ),
                dataTestId: 'acknowledgement-report-acknowledged',
              },
              {
                tabLabel: (isActive) => tabLabel('Pending', isActive),
                tabContent: <Pending post={post} closeModal={closeModal} />,
                dataTestId: 'acknowledgement-report-pending',
              },
            ]}
          />
          <div
            className="py-4 center cursor-pointer absolute top-2 right-4"
            onClick={() => {
              if (!exportMutation.isLoading) {
                return exportMutation.mutate();
              }
            }}
            data-testid="acknowledgement-export-report"
          >
            {exportMutation.isLoading ? (
              <Spinner className="h-4 w-4 mr-1 text-primary-500" />
            ) : (
              <Icon name="download" size={20} color="text-primary-500" />
            )}
            <div className="text-xs font-bold text-primary-500">
              export report
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AnnouncementAnalytics;
