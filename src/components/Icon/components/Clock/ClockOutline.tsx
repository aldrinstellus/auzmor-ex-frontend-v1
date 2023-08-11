import * as React from 'react';
import { SVGProps } from 'react';
import { PRIMARY_COLOR } from 'utils/constants';

interface IconProps {
  size?: number;
  stroke?: string;
  hoveredStroke?: string;
  isActive?: boolean;
}

const SvgClockOutline = ({
  size = 24,
  stroke = '#737373',
  hoveredStroke = PRIMARY_COLOR,
  isActive = false,
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => (
  <>
    {/* Hovered state*/}
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...props}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={!isActive ? 'hidden group-hover:block cursor-pointer' : ''}
    >
      <path
        d="M15.71 15.18L12.61 13.33C12.07 13.01 11.63 12.24 11.63 11.61V7.51M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z"
        stroke={hoveredStroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>

    {/* Normal state */}
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...props}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={isActive ? 'hidden' : 'group-hover:hidden'}
    >
      <path
        d="M15.71 15.18L12.61 13.33C12.07 13.01 11.63 12.24 11.63 11.61V7.51M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </>
);

export default SvgClockOutline;
