import { SVGProps } from 'react';

const SvgCarouselLeftFilled = (props: SVGProps<SVGSVGElement>) => (
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
      d="M17.9973 21.2787L13.6506 16.9321C13.1373 16.4187 13.1373 15.5788 13.6506 15.0654L17.9973 10.7188"
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

export default SvgCarouselLeftFilled;
