import * as React from 'react';
import { SVGProps } from 'react';

interface IconProps {
  size?: number;
  fill?: string;
}

const SvgCarouselCloseFilled = ({
  size = 60,
  fill = '#171717',
}: SVGProps<SVGSVGElement> & IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" fill="white" />
    <path
      d="M10.6641 21.6693L16.3307 16.0026M16.3307 16.0026L21.5776 10.7557M16.3307 16.0026L10.6641 10.3359M16.3307 16.0026L21.9974 21.6693"
      stroke={fill}
      strokeLinecap="round"
    />
    <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" stroke="#E5E5E5" />
  </svg>
);

export default SvgCarouselCloseFilled;
