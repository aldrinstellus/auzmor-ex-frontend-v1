import clsx from 'clsx';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import Tabs from 'components/Tabs';
import Acknowledged from './Acknowledged';
import Pending from './Pending';
import { useMutation } from '@tanstack/react-query';
import { downloadAcknowledgementReport } from 'queries/post';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import Spinner from 'components/Spinner';
import { FC } from 'react';

type AppProps = {
  open: boolean;
  closeModal: () => any;
  post: Record<string, any>;
};

const AnnouncementAnalytics: FC<AppProps> = ({ post, open, closeModal }) => {
  const tabLabel = (label: string, isActive: boolean) => {
    return (
      <span
        className={clsx({
          'font-bold': true,
          'text-neutral-900': isActive,
          'text-neutral-500 hover:text-neutral-900': !isActive,
        })}
      >
        {label}
      </span>
    );
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
        successToastConfig({
          content: 'Report exported successfully',
          dataTestId: 'acknowledgement-report-export-toast-message',
        });
      },
    },
  );

  return (
    <Modal open={open} className="max-w-2xl overflow-hidden">
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
