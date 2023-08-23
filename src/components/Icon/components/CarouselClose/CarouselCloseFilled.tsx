import * as React from 'react';
import { SVGProps } from 'react';

const SvgCarouselCloseFilled = (props: SVGProps<SVGSVGElement>) => (
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
      d="M10.6641 21.6693L16.3307 16.0026M16.3307 16.0026L21.5776 10.7557M16.3307 16.0026L10.6641 10.3359M16.3307 16.0026L21.9974 21.6693"
      stroke="currentColor"
      strokeLinecap="round"
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

export default SvgCarouselCloseFilled;
