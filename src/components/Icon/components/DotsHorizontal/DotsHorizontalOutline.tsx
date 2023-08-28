import * as React from 'react';
import { SVGProps } from 'react';

const SvgDotsHorizontalOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 20 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3 1C1.9 1 1 1.9 1 3C1 4.1 1.9 5 3 5C4.1 5 5 4.1 5 3C5 1.9 4.1 1 3 1Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M17 1C15.9 1 15 1.9 15 3C15 4.1 15.9 5 17 5C18.1 5 19 4.1 19 3C19 1.9 18.1 1 17 1Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M10 1C8.9 1 8 1.9 8 3C8 4.1 8.9 5 10 5C11.1 5 12 4.1 12 3C12 1.9 11.1 1 10 1Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

export default SvgDotsHorizontalOutline;
