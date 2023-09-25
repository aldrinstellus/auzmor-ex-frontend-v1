import { FC } from 'react';
import truncate from 'lodash/truncate';
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
    className: 'rounded-full',
    key: data.icon?.original,
    alt: 'app-icon',
    blurhash: data.icon?.blurHash,
    dataTestid: `app-icon`,
  };
  return (
    <Link to={data.url} target="_blank">
      <div
        className="flex flex-col items-center gap-2"
        data-testid="app-launcher-app"
      >
        <div className="p-[12px] rounded-full border border-neutral-200 h-[60px] w-[60px]">
          <BlurImg {...blurImageProps} />
        </div>
        <Tooltip
          tooltipContent={data.label}
          showTooltip={data.label.length > 12}
        >
          <p className="text-xs truncate" data-tip={data.label}>
            {truncate(data.label, {
              length: 12,
              separator: '',
            })}
          </p>
        </Tooltip>
      </div>
    </Link>
  );
};

export default AppWidgetCard;
