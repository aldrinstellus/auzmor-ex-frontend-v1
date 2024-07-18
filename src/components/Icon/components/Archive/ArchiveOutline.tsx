import { SVGProps } from 'react';

const SvgArchiveOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 6.813v5.853c0 1.333-.333 2-2 2H5c-1.667 0-2-.667-2-2V6.812M3.334 1.332h9.333c1.334 0 2 .667 2 2v1.333c0 1.334-.666 2-2 2H3.334c-1.333 0-2-.666-2-2V3.332c0-1.333.667-2 2-2z"
    ></path>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.787 9.332h2.427"
    ></path>
  </svg>
);

export default SvgArchiveOutline;
