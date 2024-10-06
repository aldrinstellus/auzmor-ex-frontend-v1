import React, { FC } from 'react';
import {
  CHANNEL_STATUS,
  ChannelVisibilityEnum,
  IChannel,
} from 'stores/channelStore';
import Icon from 'components/Icon';
import { useTranslation } from 'react-i18next';
import IconWrapper, {
  Type as IconWrapperType,
} from 'components/Icon/components/IconWrapper';
import Button, { Variant, Size } from 'components/Button';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';

import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { useMutation } from '@tanstack/react-query';
import queryClient from 'utils/queryClient';
import useModal from 'hooks/useModal';
import ChannelDeleteModal from './ChannelDeleteModal';
import { useCurrentTimezone } from '../../../hooks/useCurrentTimezone';
import moment from 'moment';
import { getChannelLogoImage, getFullName } from '../../../utils/misc';
import Truncate from 'components/Truncate';
import Avatar from 'components/Avatar';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';

export const formatDate = (date: string, timezone: string) => {
  const momentDate = moment.tz(date, timezone);
  return `${momentDate.format('ddd, MMM DD')} at ${momentDate.format(
    'hh:mm a',
  )}`;
};

interface IChannelRowProps {
  channel: IChannel;
}

const ChannelRow: FC<IChannelRowProps> = ({ channel }) => {
  const { t } = useTranslation('channels');
  const { currentTimezone } = useCurrentTimezone();
  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useModal();
  const { getApi } = usePermissions();
  const updateChannel = getApi(ApiEnum.UpdateChannel);
  const unarchiveChannelMutation = useMutation({
    mutationKey: ['unarchive-channel', channel.id],
    mutationFn: (id: string) =>
      updateChannel(id, { status: CHANNEL_STATUS.ACTIVE }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onError: (error) => {
      failureToastConfig({ content: t('channelRow.errorUnarchivingChannel') });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channel'] });
      successToastConfig({
        content: t('channelRow.successUnarchivingChannel'),
      });
    },
  });

  return (
    <div className="flex items-center w-full px-6 gap-4 py-8">
      <Avatar
        ariaLabel={''}
        image={getChannelLogoImage(channel)}
        size={80}
        dataTestId={'edit-profile-pic'}
      />
      <div className="flex justify-between w-[calc(100%-80px)] items-center">
        <div className="flex flex-col gap-0.5 max-w-[70%]">
          {channel.name && (
            <Truncate
              text={channel.name || ''}
              className="font-bold text-xl leading-normal text-neutral-900"
            />
          )}
          {channel.description && (
            <Truncate
              text={channel.description || ''}
              className="text-xs leading-normal  text-neutral-500"
            />
          )}
          <p className="text-xs  leading-normal text-neutral-500">
            {t('ownedBy')}
            &nbsp;
            <span className="text-xs text-primary-500 font-bold">
              {getFullName(channel.createdBy)}
            </span>
          </p>
          <div className="flex mt-1 gap-8 items-center">
            <div className="flex gap-3 items-center">
              <IconWrapper
                type={IconWrapperType.Square}
                className="h-[24px] w-[24px]"
                dataTestId={`contact-info-edit`}
              >
                <Icon
                  name={
                    channel.settings?.visibility ===
                    ChannelVisibilityEnum.Private
                      ? 'lock'
                      : 'website'
                  }
                  color="text-primary-500"
                  hover={false}
                  size={16}
                />
              </IconWrapper>
              <p className="text-xs text-neutral-500">
                {channel.settings?.visibility === ChannelVisibilityEnum.Private
                  ? t('private')
                  : t('public')}
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <IconWrapper
                type={IconWrapperType.Square}
                className="h-[24px] w-[24px]"
                dataTestId={`contact-info-edit`}
              >
                <Icon
                  name="people"
                  color="text-primary-500"
                  hover={false}
                  size={16}
                />
              </IconWrapper>
              <p className="text-xs text-neutral-500">
                {channel?.totalMembers}&nbsp;{t('member')}
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <IconWrapper
                type={IconWrapperType.Square}
                className="h-[24px] w-[24px]"
                dataTestId={`contact-info-edit`}
              >
                <Icon
                  name="chartOutline"
                  color="text-primary-500"
                  hover={false}
                  size={16}
                />
              </IconWrapper>
              <p className="text-xs text-neutral-500">
                {channel?.categories
                  ?.map((category) => category.name)
                  ?.join(', ') || ''}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-end flex-col gap-3">
          <p className="text-xs text-neutral-500">
            {t('channelRow.archivedOn')}
            {channel.updatedAt
              ? ` ${formatDate(channel.updatedAt, currentTimezone)}`
              : ''}
            {channel.updatedBy ? (
              <span className="text-primary-500 font-bold">
                {` ${t('channelRow.by')} ${getFullName(channel.updatedBy)}`}
              </span>
            ) : null}
          </p>
          <div className="flex gap-3">
            <Button
              label={t('unarchive')}
              loading={unarchiveChannelMutation.isLoading}
              variant={Variant.Secondary}
              size={Size.Small}
              onClick={() => unarchiveChannelMutation.mutate(channel.id)}
            />
            <Button
              label={t('permanentlyDelete')}
              variant={Variant.Secondary}
              size={Size.Small}
              onClick={() => openDeleteModal()}
              className="border-none text-red-500 hover:text-red-700"
            />
          </div>
        </div>
      </div>
      {isDeleteModalOpen && (
        <ChannelDeleteModal
          isOpen={isDeleteModalOpen}
          closeModal={closeDeleteModal}
          channelData={channel}
        />
      )}
    </div>
  );
};

export default ChannelRow;
