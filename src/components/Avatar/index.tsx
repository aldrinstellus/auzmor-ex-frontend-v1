import React, { MouseEventHandler, ReactNode, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import isDarkColor from 'is-dark-color';
import { getInitials } from 'utils/misc';
import Spinner from 'components/Spinner';
import { PRIMARY_COLOR } from 'utils/constants';

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
};

const Avatar: React.FC<AvatarProps> = ({
  name = 'U',
  className = '',
  round = true,
  active = true,
  onClick = () => {},
  image = '',
  size = 48,
  showActiveIndicator = false,
  bgColor = '#343434',
  indicatorIcon = null,
  loading = false,
  dataTestId = '',
  disable = false,
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
        { 'object-cover': true },
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
      width: `${size}px`,
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
    { 'font-bold': true },
    { 'flex items-center': true },
  );

  return (
    <div
      className={containerStyles}
      style={{ ...divStyle, pointerEvents: disable ? 'none' : 'auto' }}
      onClick={onClick}
      data-testid={dataTestId}
    >
      {!!image && !loading ? (
        <img
          className={imgStyles}
          style={{ ...divStyle, pointerEvents: disable ? 'none' : 'auto' }}
          src={image}
          alt={name}
        />
      ) : (
        <span className={textStyles} style={{ fontSize: `${size * 0.45}px` }}>
          {loading && <Spinner color={PRIMARY_COLOR} />}
          {!loading && name && getInitials(name)}
        </span>
      )}
      {!!indicatorIcon && !loading
        ? indicatorIcon
        : showActiveIndicator && activeIndicator}
    </div>
  );
};

export default Avatar;
