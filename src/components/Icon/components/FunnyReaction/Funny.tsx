import * as React from 'react';
import { SVGProps } from 'react';

type IconProps = {
  size?: number;
  fill?: string;
};

const SvgFunny = ({
  size = 24,
  fill = '#737373',
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    {...props}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="1" y="1" width="26" height="26" rx="13" fill="#8DA2FB" />
    <circle cx="14" cy="14" r="6" fill="#E5EDFF" />
    <path
      d="M11.1289 11.729C11.4257 11.2004 12.3212 10.3576 13.5289 11.2147"
      stroke="#E5EDFF"
      strokeWidth="1.02857"
      strokeLinecap="round"
    />
    <path
      d="M10.957 11.4712C11.2856 10.9426 12.277 10.0997 13.6142 10.9569"
      stroke="#171717"
      strokeWidth="1.02857"
      strokeLinecap="round"
    />
    <path
      d="M14.5321 11.1735C15.0227 10.8085 16.207 10.3986 17.0197 11.6788"
      stroke="#E5EDFF"
      strokeWidth="1.02857"
      strokeLinecap="round"
    />
    <path
      d="M14.5321 10.9157C15.0324 10.5549 16.2461 10.1576 17.0985 11.4547"
      stroke="#171717"
      strokeWidth="1.02857"
      strokeLinecap="round"
    />
    <path
      d="M17.7 13.7709C14.1522 13.4642 11.3687 13.6379 10.2631 13.7648C10.1712 13.7754 10.1067 13.8589 10.118 13.9507C10.4249 16.4445 11.9847 17.4723 13.9139 17.5562C15.8387 17.6399 17.7636 16.0894 17.8535 13.9417C17.8572 13.8531 17.7884 13.7786 17.7 13.7709Z"
      fill="white"
      stroke="#723B13"
      strokeWidth="0.685714"
      strokeLinecap="round"
    />
    <rect
      x="1"
      y="1"
      width="26"
      height="26"
      rx="13"
      stroke="white"
      strokeWidth="2"
    />
  </svg>
);

export default SvgFunny;
