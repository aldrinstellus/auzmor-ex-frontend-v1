import Card from 'components/Card';
import { updateChannelLinks, useChannelLinksWidget } from 'queries/channel';
import Button, { Size, Variant } from 'components/Button';
import Icon from 'components/Icon';
import SkeletonLoader from './components/SkeletonLoader';

import EmptyState from './components/EmptyState';
import { FC, memo, useState } from 'react';
import useModal from 'hooks/useModal';
import EditLinksModal from './components/EditLinksModal';
import { useTranslation } from 'react-i18next';
import AddLinkModal from './components/AddLinkModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IChannelLink } from 'stores/channelStore';
import useRole from 'hooks/useRole';

export interface ILinkWidgetProps {
  channelId?: string;
  className?: string;
}

const LinksWidget: FC<ILinkWidgetProps> = ({ channelId = '' }) => {
  const queryClient = useQueryClient();
  const { isAdmin } = useRole();
  const [open, openCollpase, closeCollapse] = useModal(true, false);
  const [openEditLinks, openEditLinksModal, closeEditLinksModal] = useModal(
    false,
    false,
  );
  const [openAddLink, openAddLinkModal, closeAddLinkModal] = useModal(
    false,
    false,
  );
  const [isEditMode, setIsEditMode] = useState(false);

  const { t } = useTranslation('channelLinksWidget');

  const { data: links, isLoading } = useChannelLinksWidget(channelId);

  const updateLinksMutation = useMutation({
    mutationKey: ['update-channel-links'],
    mutationFn: (payload: IChannelLink[]) => {
      return updateChannelLinks(channelId, { links: payload });
    },
    onError: (error: any) => console.log(error),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['channel-links-widget']);
      closeAddLinkModal();
    },
  });

  const toggleModal = () => {
    if (open) closeCollapse();
    else openCollpase();
  };

  const maxListSize = 4;

  return (
    <Card className="py-6 flex flex-col rounded-9xl" shadowOnHover>
      <div
        className="px-4 flex items-center justify-between cursor-pointer"
        data-testid="links-widget"
      >
        <div className="font-bold flex-auto" onClick={toggleModal}>
          {t('title')}
        </div>
        <div className="flex items-center gap-1">
          {isAdmin && links && links.length > 0 && (
            <Icon
              name={'edit'}
              size={20}
              color="text-neutral-900"
              onClick={() => {
                setIsEditMode(true);
                openEditLinksModal();
              }}
              dataTestId="links-widget-edit"
            />
          )}
          <Icon
            name={open ? 'arrowUp' : 'arrowDown'}
            size={20}
            color="text-neutral-900"
            onClick={toggleModal}
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
            {links && links.length ? (
              <div className="flex flex-col items-start gap-y-2">
                {links.slice(0, maxListSize).map((link, index) => (
                  <div
                    key={index}
                    className="w-full flex justify-start items-center gap-x-2 px-1 py-2 cursor-pointer group"
                    onClick={() => {
                      const linkUrl = link.url.startsWith('http')
                        ? link.url
                        : `https://${link.url}`;
                      window.open(linkUrl, '_blank');
                    }}
                  >
                    {link.image || link.favicon ? (
                      <img
                        src={link.image || link.favicon}
                        height={16}
                        width={16}
                      />
                    ) : (
                      <Icon name="link" size={16} />
                    )}
                    <span className="hover:text-blue-500 group-hover:text-blue-500 hover:underline group-hover:underline">
                      {link.title}
                    </span>
                  </div>
                ))}
                {links.length > maxListSize && (
                  <div className="w-full flex justify-center">
                    <Button
                      label={t('showAllLinksCTA')}
                      variant={Variant.Secondary}
                      size={Size.Small}
                      className="border-1 border-neutral-200 hover:border-primary-500 w-full"
                      onClick={() => {
                        setIsEditMode(false);
                        openEditLinksModal();
                      }}
                    />
                  </div>
                )}
                {links.length <= maxListSize && isAdmin && (
                  <div className="w-full flex justify-center">
                    <Button
                      label={t('addLinksCTA')}
                      variant={Variant.Primary}
                      leftIcon="addCircle"
                      iconColor="text-white"
                      leftIconClassName="hover:text-white group-hover:text-white"
                      size={Size.Small}
                      className="w-full"
                      onClick={openAddLinkModal}
                    />
                  </div>
                )}
              </div>
            ) : (
              <EmptyState openModal={openAddLinkModal} isAdmin={isAdmin} />
            )}
          </div>
        )}
      </div>
      {openEditLinks && (
        <EditLinksModal
          open={openEditLinks}
          closeModal={closeEditLinksModal}
          channelId={channelId}
          isEditMode={isEditMode}
          links={links}
        />
      )}
      {isAdmin && openAddLink && (
        <AddLinkModal
          open={openAddLink}
          closeModal={closeAddLinkModal}
          isCreateMode={true}
          setLinkDetails={(link) => {
            updateLinksMutation.mutate([link]);
          }}
        />
      )}
    </Card>
  );
};

export default memo(LinksWidget);
