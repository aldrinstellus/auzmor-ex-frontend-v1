import React, { FC } from 'react';
import { IChannel } from 'stores/channelStore';
import Icon from 'components/Icon';
import { useTranslation } from 'react-i18next';
import IconWrapper, {
  Type as IconWrapperType,
} from 'components/Icon/components/IconWrapper';
import { titleCase } from 'utils/misc';
import Button, { Variant, Size } from 'components/Button';

interface IChannelRowProps {
  channel: IChannel;
}

const ChannelRow: FC<IChannelRowProps> = ({ channel }) => {
  const { t } = useTranslation('channels');
  return (
    <div className="flex items-center w-full px-6 gap-4">
      <div className="w-20 h-20 rounded-full bg-neutral-300 border flex justify-center items-center">
        <Icon name="gallery" size={30} color="text-white" hover={false} />
      </div>
      <div className="flex justify-between grow">
        <div className="flex flex-col gap-0.5">
          <p className="font-bold text-xl text-neutral-900">{channel.name}</p>
          {channel.description && (
            <p className="text-xs text-neutral-500">{channel.description}</p>
          )}
          <p className="text-xs text-neutral-500">
            {t('ownedBy')}
            &nbsp;
            <span className="text-xs text-primary-500 font-bold">
              {channel.createdBy?.name}
            </span>
          </p>
          <div className="flex gap-8 items-center">
            <div className="flex gap-3 items-center">
              <IconWrapper
                type={IconWrapperType.Square}
                className="h-[24px] w-[24px]"
                dataTestId={`contact-info-edit`}
              >
                <Icon
                  name="lock"
                  color="text-primary-500"
                  hover={false}
                  size={16}
                />
              </IconWrapper>
              <p className="text-xs text-neutral-500">
                {titleCase(channel.channelSettings?.visibility || '')}
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
                {channel?.category?.name}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-end flex-col gap-3">
          <p className="text-xs text-neutral-500">
            Archived on 27th august 2022 at 4:20 pm by{' '}
            <span className="text-primary-500 font-bold">Kate Banks</span>
          </p>
          <div className="flex gap-3">
            <Button
              label={t('unarchive')}
              variant={Variant.Secondary}
              size={Size.Small}
            />
            <Button
              label={t('permanentlyDelete')}
              variant={Variant.Secondary}
              size={Size.Small}
              className="border-none text-red-500 hover:text-red-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelRow;
