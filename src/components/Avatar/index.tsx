import React, { MouseEventHandler, useMemo } from 'react';
import clsx from 'clsx';
import isDarkColor from 'is-dark-color';
import { getInitials } from 'utils/misc';

export type AvatarProps = {
  name: string;
  onClick?: MouseEventHandler<Element>;
  className?: string;
  image?: string;
  round?: boolean;
  showActiveIndicator?: boolean;
  active?: boolean;
  size?: number;
  bgColor?: string;
};

const Avatar: React.FC<AvatarProps> = ({
  name,
  className = '',
  round = true,
  active = true,
  onClick = () => {},
  image = '',
  size = 48,
  showActiveIndicator = false,
  bgColor = '#343434',
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
    [size],
  );

  const activeIndicator = useMemo(() => {
    return (
      active && (
        <div
          style={{ height: `${size / 5}px`, width: `${size / 5}px` }}
          className={indicatorStyles}
        />
      )
    );
  }, []);

  const isBgDark = isDarkColor(bgColor);

  const textStyles = clsx(
    { 'text-white': isBgDark },
    { 'text-neutral-800': !isBgDark },
    { 'font-bold': true },
  );

  return (
    <div className={containerStyles} style={divStyle} onClick={onClick}>
      {!!image ? (
        <img className={imgStyles} style={divStyle} src={image} alt={name} />
      ) : (
        <span className={textStyles} style={{ fontSize: `${size * 0.45}px` }}>
          {name && getInitials(name)}
        </span>
      )}
      {showActiveIndicator && activeIndicator}
    </div>
  );
};

export default Avatar;
