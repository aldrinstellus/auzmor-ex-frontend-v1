import * as React from 'react';
import { SVGProps } from 'react';

type IconProps = {
  size?: number;
  stroke?: string;
};

const SvgUserManagementOutline = ({
  size = 20,
  stroke = '#737373',
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M10.099 10.6497C10.0406 10.6414 9.96563 10.6414 9.89896 10.6497C8.43229 10.5997 7.26562 9.39974 7.26562 7.92474C7.26562 6.41641 8.48229 5.19141 9.99896 5.19141C11.5073 5.19141 12.7323 6.41641 12.7323 7.92474C12.724 9.39974 11.5656 10.5997 10.099 10.6497Z"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M15.6161 16.1508C14.1328 17.5091 12.1661 18.3341 9.99948 18.3341C7.83281 18.3341 5.86615 17.5091 4.38281 16.1508C4.46615 15.3674 4.96615 14.6008 5.85781 14.0008C8.14115 12.4841 11.8745 12.4841 14.1411 14.0008C15.0328 14.6008 15.5328 15.3674 15.6161 16.1508Z"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M10.0013 18.3327C14.6037 18.3327 18.3346 14.6017 18.3346 9.99935C18.3346 5.39698 14.6037 1.66602 10.0013 1.66602C5.39893 1.66602 1.66797 5.39698 1.66797 9.99935C1.66797 14.6017 5.39893 18.3327 10.0013 18.3327Z"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export default SvgUserManagementOutline;
