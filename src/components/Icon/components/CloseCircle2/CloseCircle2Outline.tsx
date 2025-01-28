import { SVGProps } from 'react';

const SvgCloseCircle2Outline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="9" cy="9" r="8.5" stroke="currentColor" />
    <path
      d="M5 5L12.8399 12.8399"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <path
      d="M13 5L5.1601 12.8399"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </svg>
);

export default SvgCloseCircle2Outline;
