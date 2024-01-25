import { SVGProps } from 'react';

const SvgNewsOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    fill="none"
    viewBox="0 0 14 14"
    {...props}
  >
    <path
      stroke="#171717"
      d="M10.333 3.667H11a2 2 0 012 2v5.666c0 .737-.597 1.334-1.333 1.334v0h-1.334m0-9v9m0-9v-.334a2 2 0 00-2-2H3a2 2 0 00-2 2v7.334a2 2 0 002 2h7.333"
    ></path>
    <path
      stroke="#171717"
      strokeLinecap="round"
      d="M3.333 9.667H8M6.667 7h-2a1.333 1.333 0 010-2.667h2a1.333 1.333 0 010 2.667z"
    ></path>
  </svg>
);

export default SvgNewsOutline;
