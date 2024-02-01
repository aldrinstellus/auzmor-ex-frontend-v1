import { FC } from 'react';
import Icon from 'components/Icon';
import IconWrapper, {
  Type as IconWrapperType,
} from 'components/Icon/components/IconWrapper';
import Truncate from 'components/Truncate';
import Button, {
  Size as ButtonSize,
  Variant as ButtonVariant,
} from 'components/Button';
import Card from 'components/Card';
import { ChannelPrivacyEnum, IChannel } from 'stores/channelStore';
import DefaultCoverImage from 'images/png/CoverImage.png';

interface IChannelCardProps {
  channel: IChannel;
  showRequestBtn?: boolean;
  showWithdrawBtn?: boolean;
  showJoinChannelBtn?: boolean;
}

const ChannelCard: FC<IChannelCardProps> = ({
  channel,
  showRequestBtn = false,
  showJoinChannelBtn = false,
  showWithdrawBtn = false,
}) => {
  return (
    <Card className="w-full flex flex-col gap-2 relative">
      <div className="w-full h-[80px] bg-slate-500 rounded-t-9xl">
        {channel.coverImage && channel.coverImage.original ? (
          <div className="w-full h-full relative">
            <img
              className="object-cover h-full w-full rounded-t-9xl"
              src={channel.coverImage.original}
            />
            <div className="w-full h-full bg-black top-0 left-0 absolute rounded-t-9xl opacity-30"></div>
          </div>
        ) : (
          <img
            className="object-cover h-full w-full rounded-t-9xl"
            src={DefaultCoverImage}
          />
        )}
      </div>
      <div className="p-3 flex flex-col gap-1">
        <div className="flex w-full items-center">
          <Truncate
            text={channel.name}
            className="text-sm font-semibold text-neutral-900 max-w-[208px]"
          />
          {channel.privacy === ChannelPrivacyEnum.Private && (
            <Icon
              name={'lockFilled'}
              size={14}
              color="text-red-600"
              hover={false}
              className="ml-0.5"
            />
          )}
        </div>
        <p className="text-xs font-semibold text-neutral-500">
          {channel.membersCount} members
        </p>
        <p className="text-xxs text-neutral-500 line-clamp-2">
          {channel.description}
        </p>
        {showRequestBtn && (
          <Button
            label={'Request to join'}
            size={ButtonSize.ExtraSmall}
            className="mt-2"
          />
        )}
        {showWithdrawBtn && (
          <Button
            label={'Withdraw request'}
            size={ButtonSize.ExtraSmall}
            variant={ButtonVariant.Danger}
            className="mt-2"
          />
        )}
        {showJoinChannelBtn && (
          <div className="flex gap-1 w-full mt-2">
            <Button
              label="Open channel"
              size={ButtonSize.ExtraSmall}
              variant={ButtonVariant.Secondary}
              className="grow"
            />
            <Button
              label="Join channel"
              size={ButtonSize.ExtraSmall}
              className="grow"
            />
          </div>
        )}
      </div>
      <div className="w-10 h-10 rounded-full absolute left-4 top-[52px] bg-black border border-white z-0" />
      {channel.isStarred && (
        <IconWrapper
          type={IconWrapperType.Square}
          className="cursor-pointer h-[24px] w-[24px] absolute top-2 right-2"
          dataTestId={`contact-info-edit`}
        >
          <Icon name="starFilled" color="text-yellow-200" hover={false} />
        </IconWrapper>
      )}
    </Card>
  );
};

export default ChannelCard;
