import * as React from 'react';
import { SVGProps } from 'react';
import { PRIMARY_COLOR } from 'utils/constants';
import { twConfig } from 'utils/misc';

interface IconProps {
  size?: number;
  stroke?: string;
  hoveredStroke?: string;
}

const SvgPeopleOutline = ({
  size = 24,
  stroke = '#737373',
  hoveredStroke = PRIMARY_COLOR,
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => (
  <>
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
        d="M16.8008 16.8008C16.8008 15.5278 16.2951 14.3069 15.3949 13.4067C14.4947 12.5065 13.2738 12.0008 12.0008 12.0008M12.0008 12.0008C10.7278 12.0008 9.50687 12.5065 8.60669 13.4067C7.70652 14.3069 7.20081 15.5278 7.20081 16.8008M12.0008 12.0008C13.3263 12.0008 14.4008 10.9263 14.4008 9.60081C14.4008 8.27532 13.3263 7.20081 12.0008 7.20081C10.6753 7.20081 9.60081 8.27532 9.60081 9.60081C9.60081 10.9263 10.6753 12.0008 12.0008 12.0008ZM22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
        stroke={hoveredStroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
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
