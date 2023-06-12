import * as React from 'react';
import { SVGProps } from 'react';
import { twConfig } from 'utils/misc';

interface IconProps {
  size?: number;
  stroke?: string;
}

const SvgPeopleOutline = ({
  size = 24,
  stroke = '#737373',
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => (
  <>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...props}
      fill="none"
      className="hidden group-hover:block"
    >
      <path
        fill={twConfig.theme.colors.primary['500']}
        d="M10.1 9.6a1.9 1.9 0 1 1 3.8 0 1.9 1.9 0 0 1-3.8 0Z"
      />
      <path
        fill={twConfig.theme.colors.primary['500']}
        fillRule="evenodd"
        d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-7.1-2.4c0 .9-.408 1.702-1.05 2.234a5.3 5.3 0 0 1 3.45 4.967.5.5 0 0 1-1 0 4.3 4.3 0 0 0-8.6 0 .5.5 0 0 1-1 0 5.3 5.3 0 0 1 3.45-4.967 2.9 2.9 0 1 1 4.75-2.233Z"
        clipRule="evenodd"
      />
    </svg>
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
        d="M16.8008 16.8008C16.8008 15.5278 16.2951 14.3069 15.3949 13.4067C14.4947 12.5065 13.2738 12.0008 12.0008 12.0008M12.0008 12.0008C10.7278 12.0008 9.50687 12.5065 8.60669 13.4067C7.70652 14.3069 7.20081 15.5278 7.20081 16.8008M12.0008 12.0008C13.3263 12.0008 14.4008 10.9263 14.4008 9.60081C14.4008 8.27532 13.3263 7.20081 12.0008 7.20081C10.6753 7.20081 9.60081 8.27532 9.60081 9.60081C9.60081 10.9263 10.6753 12.0008 12.0008 12.0008ZM22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </>
);

export default SvgPeopleOutline;
