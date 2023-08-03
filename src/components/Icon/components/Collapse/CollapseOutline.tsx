import * as React from 'react';
import { SVGProps } from 'react';
import { PRIMARY_COLOR } from 'utils/constants';

interface IconProps {
  size?: number;
  stroke?: string;
  hoveredStroke?: string;
}

const SvgCollapseOutline = ({
  size = 24,
  stroke = '#737373',
  hoveredStroke = PRIMARY_COLOR,
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
      className="hidden group-hover:block cursor-pointer"
    >
      <path
        d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
        stroke={hoveredStroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5898 13.3398H14.8298V9.09985"
        stroke={hoveredStroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.8299 13.3399L9.16992 7.67993"
        stroke={hoveredStroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 16.51C9.89 17.81 14.11 17.81 18 16.51"
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
      className="group-hover:hidden"
    >
      <path
        d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5898 13.3398H14.8298V9.09985"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.8299 13.3399L9.16992 7.67993"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 16.51C9.89 17.81 14.11 17.81 18 16.51"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </>
);

export default SvgCollapseOutline;
