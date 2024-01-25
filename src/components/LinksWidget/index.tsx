import Card from 'components/Card';
import { useChannelLinksWidget } from 'queries/channel';
import Button, { Size, Variant } from 'components/Button';
import Icon from 'components/Icon';
import SkeletonLoader from './components/SkeletonLoader';

import EmptyState from './components/EmptyState';
import { FC, memo } from 'react';
import { isEmpty } from 'lodash';
import useModal from 'hooks/useModal';
import EditLinksModal from './components/EditLinksModal';

export interface ILinkWidgetProps {
  channelId?: string;
  className?: string;
}

const LinksWidget: FC<ILinkWidgetProps> = ({ channelId = '' }) => {
  const [open, openCollpase, closeCollapse] = useModal(true, false);
  const [openEditLinks, openEditLinksModal, closeEditLinksModal] = useModal();

  const { data, isLoading } = useChannelLinksWidget(channelId);

  const links = data?.data?.result?.links || [];

  const itemCount = isEmpty(links) ? 0 : links?.length;

  const toggleModal = () => {
    if (open) closeCollapse();
    else openCollpase();
  };

  return (
    <Card className="py-6 flex flex-col rounded-9xl" shadowOnHover>
      <div
        className="px-4 flex items-center justify-between cursor-pointer"
        data-testid="links-widget"
        onClick={toggleModal}
      >
        <div className="font-bold">Useful Links</div>
        <div className="flex items-center gap-2">
          <Icon
            name={open ? 'arrowUp' : 'arrowDown'}
            size={20}
            color="text-neutral-900"
            dataTestId="links-widget-collapse"
          />
        </div>
      </div>
      <div
        className={`transition-max-h px-4 duration-300 ease-in-out overflow-hidden ${
          open ? 'max-h-[500px] mt-4' : 'max-h-[0]'
        }`}
      >
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <div className="w-full">
            {itemCount ? (
              <div className="flex flex-col items-start">
                <div className="w-full flex justify-center">
                  <Button
                    label="Show all links"
                    variant={Variant.Secondary}
                    size={Size.Small}
                    className="border-2 border-neutral-200 mt-4 w-full"
                    onClick={openEditLinksModal}
                  />
                </div>
              </div>
            ) : (
              <EmptyState openModal={openEditLinksModal} />
            )}
          </div>
        )}
      </div>
      {openEditLinks && (
        <EditLinksModal
          open={openEditLinks}
          closeModal={closeEditLinksModal}
          links={links}
        />
      )}
    </Card>
  );
};

export default memo(LinksWidget);
