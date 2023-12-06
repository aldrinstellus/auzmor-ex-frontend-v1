/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, MouseEventHandler, ReactNode, memo, useMemo } from 'react';
import clsx from 'clsx';
import isDarkColor from 'is-dark-color';
import { getInitials } from 'utils/misc';
import Spinner from 'components/Spinner';
import BlurImg from 'components/Image/components/BlurImg';
import Icon from 'components/Icon';

export type AvatarProps = {
  name?: string;
  onClick?: MouseEventHandler<Element>;
  className?: string;
  image?: string;
  round?: boolean;
  showActiveIndicator?: boolean;
  active?: boolean;
  size?: number;
  bgColor?: string;
  indicatorIcon?: ReactNode;
  loading?: boolean;
  dataTestId?: string;
  disable?: boolean;
  blurhash?: string;
  isCounter?: boolean;
  fontSize?: number;
  outOfOffice?: boolean;
};

const Avatar: FC<AvatarProps> = ({
  name = 'U',
  className = '',
  round = true,
  active = true,
  onClick = () => {},
  image = '',
  size = 48,
  showActiveIndicator = false,
  bgColor = '#262626',
  indicatorIcon = null,
  loading = false,
  dataTestId = '',
  disable = false,
  blurhash = '',
  isCounter = false,
  outOfOffice = false,
}) => {
  const containerStyles = useMemo(
    () =>
      clsx(
        { 'relative flex justify-center items-center': true },
        {
          'rounded-full': round,
        },
        {
          'rounded-lg': !round,
        },
        {
          [className]: true,
        },
      ),
    [round],
  );

  const imgStyles = useMemo(
    () =>
      clsx(
        { 'object-cover h-full w-full': true },
        {
          'rounded-full': round,
        },
        {
          'rounded-lg': !round,
        },
      ),
    [round],
  );

  const indicatorStyles = clsx(
    { 'absolute bg-green-400 border-2 border-white rounded-full': true },
    { 'top-0 right-0': round },
    { '-top-1 -right-1': !round },
  );

  const divStyle = useMemo(
    () => ({
      height: `${size}px`,
      minHeight: `${size}px`,
      width: `${size}px`,
      minWidth: `${size}px`,
      backgroundColor: bgColor,
    }),
    [size, bgColor],
  );

  const activeIndicator = useMemo(() => {
    return null;
    return (
      active && (
        <div
          style={{ height: `${size / 5}px`, width: `${size / 5}px` }}
          className={indicatorStyles}
          data-testid="people-card-status-active"
        />
      )
    );
  }, []);
  const isBgDark = isDarkColor(bgColor);

  const textStyles = clsx(
    { 'text-white': isBgDark },
    { 'text-neutral-800': !isBgDark },
    { 'font-medium': true },
    { 'flex items-center': true },
  );

  const blurImageProps = {
    src: image,
    className: imgStyles,
    key: name,
    alt: name,
    blurhash: blurhash,
    'data-testid': `${dataTestId}-avatar-img`,
  };

  const avatarName = name && !isCounter ? getInitials(name) : name;

  return (
    <div
      className={containerStyles}
      style={{ ...divStyle, pointerEvents: disable ? 'none' : 'auto' }}
      onClick={onClick}
      data-testid={dataTestId}
    >
      {!!image && !loading ? (
        <BlurImg {...blurImageProps} />
      ) : (
        <span
          className={textStyles}
          style={{
            fontSize: isCounter ? `${size * 0.3}px` : `${size * 0.375}px`,
          }}
        >
          {loading && <Spinner />}
          {!loading && avatarName}
        </span>
      )}
      {(() => {
        if (outOfOffice) {
          return (
            <div className="absolute -top-1 -right-1">
              <Icon name="outOfOffice" />
            </div>
          );
        }
        return null;
      })()}
    </div>
  );
};

export default memo(Avatar);
