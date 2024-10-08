import { useMemo, FC } from 'react';
import clsx from 'clsx';

import BlurImg from 'components/Image/components/BlurImg';
import DefaultAppIcon from 'images/DefaultAppIcon.svg';

import { IApp } from 'interfaces';
import Icon from 'components/Icon';
import { useTranslation } from 'react-i18next';

interface IAppCardProps {
  data: IApp;
  isSelected: boolean;
  onSelect: (isSelected: boolean, app: IApp) => void;
  disabled: boolean;
}

const AppCard: FC<IAppCardProps> = ({
  data,
  isSelected,
  onSelect,
  disabled,
}) => {
  const { t } = useTranslation('appLauncher');
  const blurImageProps = {
    src: data.icon?.original || DefaultAppIcon,
    className: 'rounded-full',
    key: data.icon?.original,
    alt: 'app-icon',
    blurhash: data.icon?.blurHash,
    'data-testid': `app-icon`,
  };
  const cardStyle = useMemo(
    () =>
      clsx(
        {
          'flex flex-col justify-center gap-2 relative overflow-hidden min-w-[128px] max-w-[128px] h-[75px] px-2 pt-3 pb-4 border rounded-[8px] cursor-pointer':
            true,
        },
        {
          '!border-primary-500 shadow-xl transition-all duration-300 ease-in-out':
            isSelected,
        },
        {
          'shadow-none border-neutral-100 transition-all duration-300 ease-out':
            !isSelected,
        },
        { 'opacity-50 pointer-events-none': disabled },
      ),
    [isSelected, disabled],
  );

  return (
    <div
      className={cardStyle}
      data-testid="app-launcher-select-app"
      onClick={() => onSelect(isSelected, data)}
    >
      {data.featured && (
        <div className="absolute top-0 left-0 bg-blue-500 text-white px-2 py-[2px] text-xxs rounded-br-[8px]">
          {t('featured')}
        </div>
      )}
      {isSelected && (
        <Icon
          name="tickCircleFilled"
          className="absolute top-[2px] right-[2px]"
          color="text-primary-500"
          hover
        />
      )}
      <div className={`flex items-center gap-1 ${data.featured && 'mt-3'}`}>
        <div className="p-[3px] rounded bg-neutral-100 min-h-[24px] max-h-[24px] min-w-[24px] max-w-[24px]">
          <BlurImg {...blurImageProps} />
        </div>
        <p className="text-xs truncate">{data.label}</p>
      </div>
    </div>
  );
};

export default AppCard;
