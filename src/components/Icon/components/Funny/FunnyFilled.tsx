import * as React from 'react';
import { SVGProps } from 'react';

type IconProps = {
  size?: number;
  fill?: string;
};

const SvgFunnyFilled = ({
  size = 16,
  fill = '#737373',
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    fill="none"
  >
    <circle cx="12" cy="12" r="12" fill="#8DA2FB" />
    <path
      d="M6.25684 7.45798C6.85038 6.40084 8.64135 4.71512 11.0568 6.42941"
      stroke="#B4C6FC"
      strokeWidth="1.02857"
      strokeLinecap="round"
    />
    <path
      d="M5.91406 6.94236C6.57121 5.88521 8.55406 4.1995 11.2283 5.91378"
      stroke="#3D291E"
      strokeWidth="1.02857"
      strokeLinecap="round"
    />
    <path
      d="M13.0662 6.34704C14.0473 5.61707 16.4159 4.79722 18.0413 7.35761"
      stroke="#B4C6FC"
      strokeWidth="1.02857"
      strokeLinecap="round"
    />
    <path
      d="M13.0662 5.83141C14.0668 5.10978 16.4942 4.3151 18.1989 6.90944"
      stroke="#3D291E"
      strokeWidth="1.02857"
      strokeLinecap="round"
    />
    <path
      d="M19.5575 11.5555C12.2043 10.9072 6.46817 11.2925 4.36346 11.549C4.27157 11.5602 4.20746 11.6446 4.21764 11.7366C4.78253 16.8438 7.92816 18.9428 11.8288 19.1124C15.725 19.2818 19.6213 16.1032 19.7128 11.727C19.7147 11.6383 19.6459 11.5633 19.5575 11.5555Z"
      fill="white"
      stroke="#624C41"
      strokeWidth="0.685714"
      strokeLinecap="round"
    />
  </svg>
);

export default SvgFunnyFilled;
