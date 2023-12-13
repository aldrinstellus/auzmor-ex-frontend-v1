import { FC } from 'react';
import { Link } from 'react-router-dom';

import BlurImg from 'components/Image/components/BlurImg';
import DefaultAppIcon from 'images/DefaultAppIcon.svg';

import { App } from 'queries/apps';
import Tooltip from 'components/Tooltip';

interface IAppWidgetCardProps {
  data: App;
}

const AppWidgetCard: FC<IAppWidgetCardProps> = ({ data }) => {
  const blurImageProps = {
    src: data.icon?.original || DefaultAppIcon,
    className: 'rounded-full object-contain w-full',
    key: data.icon?.original,
    alt: 'app-icon',
    blurhash: data.icon?.blurHash,
    'data-testid': `app-icon`,
  };
  return (
    <Link
      to={`${window.location.origin}/apps/${data.id}/launch`}
      target="_blank"
    >
      <div
        className="flex flex-col items-center gap-2"
        data-testid="app-launcher-app"
      >
        <Tooltip tooltipContent={data.label}>
          <div className="flex items-center justify-center p-2 rounded-9xl border border-neutral-200 h-[60px] w-[60px] cursor-pointer">
            <BlurImg {...blurImageProps} />
          </div>
        </Tooltip>
      </div>
    </Link>
  );
};

export default AppWidgetCard;
