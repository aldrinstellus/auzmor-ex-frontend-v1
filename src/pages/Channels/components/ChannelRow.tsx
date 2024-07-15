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
import { updateChannel } from 'queries/channel';
import FailureToast from 'components/Toast/variants/FailureToast';
import { toast } from 'react-toastify';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import { twConfig } from 'utils/misc';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { useMutation } from '@tanstack/react-query';
import queryClient from 'utils/queryClient';
import useModal from 'hooks/useModal';
import ChannelDeleteModal from './ChannelDeleteModal';
import { useCurrentTimezone } from '../../../hooks/useCurrentTimezone';
import moment from 'moment';
import { getFullName } from '../../../utils/misc';

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
  const unarchiveChannelMutation = useMutation({
    mutationKey: ['unarchive-channel', channel.id],
    mutationFn: (id: string) =>
      updateChannel(id, { status: CHANNEL_STATUS.ACTIVE }),
    onError: () => {
      toast(<FailureToast content="Error archiing channel" dataTestId="" />, {
        closeButton: (
          <Icon name="closeCircleOutline" color="text-red-500" size={20} />
        ),
        style: {
          border: `1px solid ${twConfig.theme.colors.red['300']}`,
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
        },
        autoClose: TOAST_AUTOCLOSE_TIME,
        transition: slideInAndOutTop,
        theme: 'dark',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channel'] });
      toast(
        <SuccessToast
          content="Channel has been unarchived successfully"
          dataTestId="channel-toaster-message"
        />,
        {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              color="text-primary-500"
              size={20}
              dataTestId="channel-toaster-close"
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

  return (
    <div className="flex items-center w-full px-6 gap-4 py-8">
      <div className="w-20 h-20 rounded-full bg-neutral-300 border flex justify-center items-center">
        <Icon name="gallery" size={30} color="text-white" hover={false} />
      </div>
      <div className="flex justify-between items-center grow">
        <div className="flex flex-col gap-0.5">
          <p className="font-bold text-xl leading-normal text-neutral-900">
            {channel.name}
          </p>
          {channel.description && (
            <p className="text-xs  leading-normal text-neutral-500">
              {channel.description}
            </p>
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
            Archived{' '}
            {channel.updatedAt
              ? `on ${formatDate(channel.updatedAt, currentTimezone)}`
              : ''}
            {channel.updatedBy ? (
              <span className="text-primary-500 font-bold">
                {`by ${getFullName(channel.updatedBy)}`}
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
