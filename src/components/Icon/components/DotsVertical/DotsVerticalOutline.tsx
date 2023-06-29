import * as React from 'react';
import { SVGProps } from 'react';

type IconProps = {
  size?: number;
  stroke?: string;
};

const SvgDotsVerticalOutline = ({
  size = 20,
  stroke = '#737373',
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_1112_264719)">
      <g filter="url(#filter0_d_1112_264719)">
        <path
          d="M10 6.66797C9.46957 6.66797 8.96086 6.45726 8.58579 6.08218C8.21071 5.70711 8 5.1984 8 4.66797C8 4.13754 8.21071 3.62883 8.58579 3.25376C8.96086 2.87868 9.46957 2.66797 10 2.66797C10.5304 2.66797 11.0391 2.87868 11.4142 3.25376C11.7893 3.62883 12 4.13754 12 4.66797C12 5.1984 11.7893 5.70711 11.4142 6.08218C11.0391 6.45726 10.5304 6.66797 10 6.66797ZM10 12.668C9.46957 12.668 8.96086 12.4573 8.58579 12.0822C8.21071 11.7071 8 11.1984 8 10.668C8 10.1375 8.21071 9.62883 8.58579 9.25376C8.96086 8.87868 9.46957 8.66797 10 8.66797C10.5304 8.66797 11.0391 8.87868 11.4142 9.25376C11.7893 9.62883 12 10.1375 12 10.668C12 11.1984 11.7893 11.7071 11.4142 12.0822C11.0391 12.4573 10.5304 12.668 10 12.668ZM10 18.668C9.46957 18.668 8.96086 18.4573 8.58579 18.0822C8.21071 17.7071 8 17.1984 8 16.668C8 16.1375 8.21071 15.6288 8.58579 15.2538C8.96086 14.8787 9.46957 14.668 10 14.668C10.5304 14.668 11.0391 14.8787 11.4142 15.2538C11.7893 15.6288 12 16.1375 12 16.668C12 17.1984 11.7893 17.7071 11.4142 18.0822C11.0391 18.4573 10.5304 18.668 10 18.668Z"
          fill="#171717"
        />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_d_1112_264719"
        x="4"
        y="2.66797"
        width="12"
        height="24"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_1112_264719"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_1112_264719"
          result="shape"
        />
      </filter>
      <clipPath id="clip0_1112_264719">
        <rect
          width="20"
          height="20"
          fill="white"
          transform="translate(0 0.667969)"
        />
      </clipPath>
    </defs>
  </svg>
);

export default SvgDotsVerticalOutline;
