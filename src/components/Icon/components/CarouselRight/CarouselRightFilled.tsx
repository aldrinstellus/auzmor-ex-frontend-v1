import * as React from 'react';
import { SVGProps } from 'react';

const SvgCarouselRightFilled = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={60}
    height={60}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" fill="white" />
    <path
      d="M13.9375 21.2787L18.2842 16.9321C18.7975 16.4187 18.7975 15.5788 18.2842 15.0654L13.9375 10.7188"
      stroke="currentColor"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x="0.5"
      y="0.5"
      width="31"
      height="31"
      rx="7.5"
      stroke="currentColor"
    />
  </svg>
);

export default SvgCarouselRightFilled;
