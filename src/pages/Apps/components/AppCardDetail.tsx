import Badge from 'components/Badge';
import Button, { Size, Variant } from 'components/Button';
import Card from 'components/Card';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import useRole from 'hooks/useRole';
import { IApp } from 'interfaces';
import AppDetailSVG from './../../../images/appDetails.svg';
import { FC } from 'react';
import DefaultAppIcon from 'images/DefaultAppIcon.svg';
import useModal from 'hooks/useModal';
import AudienceModal, { getAudienceCount } from 'components/AudienceModal';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import Truncate from 'components/Truncate';

type AppDetailModalProps = {
  app: IApp;
  open: boolean;
  closeModal: () => void;
  openEditAppModal: () => void;
  openDeleteAppModal: () => void;
};

const AppDetailModal: FC<AppDetailModalProps> = ({
  app,
  open,
  closeModal,
  openEditAppModal,
  openDeleteAppModal,
}) => {
  const { isAdmin } = useRole();
  const { t } = useTranslation('appLauncher', {
    keyPrefix: 'appCardDetail',
  });
  const [isAudienceModalOpen, openAudienceModal, closeAudienceModal] =
    useModal(false);

  return (
    <Modal open={open} className="max-w-[638px]">
      <Card>
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex gap-x-3 items-center">
            <div className="p-1 bg-neutral-100 rounded-xl">
              <img
                src={app?.icon?.original || DefaultAppIcon}
                height={20}
                width={20}
                alt={`${app.label} ${t('imageAlt')}`}
              />
            </div>

            <Truncate
              text={app.label}
              className="text-neutral-900 text-lg font-extrabold  max-w-[250px]"
            />
          </div>
          <Icon
            name="close"
            onClick={closeModal}
            color="text-black"
            size={20}
            dataTestId="app-details-close"
          />
        </div>
        <Divider />
        {/* Body */}
        <div className="px-6 py-3">
          <div className="border-orange-300 border-1 rounded-9xl relative">
            <img
              src={AppDetailSVG}
              className="absolute"
              alt={t('detailsAlt')}
            />
            <div className="z-10 relative">
              <div className="w-full pt-4 px-5 flex justify-between">
                <div className="flex gap-2">
                  {app.category && !isEmpty(app.category) && (
                    <Badge
                      text={app.category.name}
                      textClassName="text-blue-500 text-base leading-6 font-semibold max-w-[128px]"
                      bgClassName="bg-blue-100 border-1 border-blue-300"
                      dataTestId="app-details-category"
                    />
                  )}
                  {app.featured && (
                    <Badge
                      text={t('featured')}
                      textClassName="text-white text-base leading-6 font-semibold max-w-[128px]"
                      bgClassName="bg-blue-500"
                      dataTestId="app-details-category"
                    />
                  )}
                </div>
                <div
                  className="cursor-pointer text-primary-500 text-lg font-medium flex items-center gap-1"
                  onClick={() =>
                    window.open(
                      `${window.location.origin}/apps/${app.id}/launch`,
                      '_target',
                    )
                  }
                >
                  <span>{t('visitApp')}</span>
                  <Icon name="arrowRightUp" className="text-primary-500" />
                </div>
              </div>
              <div className="pb-8">
                {/* The icon, name and description */}
                <div className="flex px-6 pt-4 gap-x-6">
                  <div className="min-w-[100px] min-h-[100px]">
                    <img
                      src={app?.icon?.original || DefaultAppIcon}
                      className="p-1 rounded-xl"
                      height={100}
                      width={100}
                      alt={t('iconAlt')}
                    />
                  </div>
                  <div>
                    <Truncate
                      text={app.label}
                      className="text-3xl text-neutral-900 font-semibold max-w-[250px]"
                      dataTestId="app-details-name"
                    />

                    <Truncate
                      text={app.description}
                      className="pt-1 text-neutral-900 font-normal max-w-[128px]"
                      dataTestId="app-details-description"
                    />
                  </div>
                </div>
                {/* The audience */}
                <div className="flex px-6 pt-4 items-center gap-2">
                  <p className="text-neutral-900 text-sm font-medium">
                    {t('audience')}:
                  </p>
                  <div className="flex items-center cursor-pointer">
                    {app.audience && app.audience.length > 0 ? (
                      <div className="flex gap-2">
                        <Button
                          key={app.audience[0].entityId}
                          leftIcon="noteFavourite"
                          leftIconSize={16}
                          leftIconClassName="mr-1"
                          size={Size.Small}
                          variant={Variant.Secondary}
                          label={
                            <Truncate
                              text={app?.audience[0]?.name || t('teamName')}
                            />
                          }
                          onClick={openAudienceModal}
                          className="group"
                          labelClassName="text-xss text-neutral-900 max-w-[128px] font-medium group-hover:text-primary-500"
                        />
                        {app.audience && app.audience.length > 1 && (
                          <Button
                            key={app.audience[0].entityId}
                            variant={Variant.Secondary}
                            size={Size.Small}
                            label={t('more', {
                              count: app.audience.length - 1,
                            })}
                            onClick={openAudienceModal}
                            className="group"
                            labelClassName="text-xss text-neutral-900 font-medium group-hover:text-primary-500"
                          />
                        )}
                      </div>
                    ) : (
                      app.audience &&
                      app.audience.length === 0 && (
                        <Button
                          variant={Variant.Secondary}
                          leftIcon={'profileUser'}
                          label="Everyone"
                          size={Size.Small}
                          className="group"
                          labelClassName="text-xss text-neutral-900 font-medium group-hover:text-primary-500"
                        />
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        {isAdmin && (
          <div className="bg-blue-50 flex items-center justify-end px-6 py-4 gap-x-3 rounded-9xl">
            <Button
              label={t('deleteApp')}
              variant={Variant.Secondary}
              onClick={openDeleteAppModal}
              dataTestId="app-details-delete-app"
            />
            <Button
              label={t('editApp')}
              onClick={openEditAppModal}
              dataTestId="app-details-edit-app"
            />
          </div>
        )}
        {isAudienceModalOpen && (
          <AudienceModal
            closeModal={closeAudienceModal}
            entityId={app.id || ''}
            entity={'apps'}
            audienceCounts={getAudienceCount(app.audience || [])}
          />
        )}
      </Card>
    </Modal>
  );
};

export default AppDetailModal;
