import * as React from 'react';
import { SVGProps } from 'react';

type IconProps = {
  size?: number;
  stroke?: string;
};

const SvgReorderOutline = ({
  size = 20,
  stroke = '#737373',
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 10 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="2" cy="2" r="2" fill="#D4D4D4" />
    <circle cx="2" cy="8" r="2" fill="#D4D4D4" />
    <circle cx="2" cy="14" r="2" fill="#D4D4D4" />
    <circle cx="8" cy="2" r="2" fill="#D4D4D4" />
    <circle cx="8" cy="8" r="2" fill="#D4D4D4" />
    <circle cx="8" cy="14" r="2" fill="#D4D4D4" />
  </svg>
);

export default SvgReorderOutline;
