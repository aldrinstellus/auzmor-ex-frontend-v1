/* eslint-disable react/no-unknown-property */
import { SVGProps } from 'react';

const SvgIntegration = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M15.833 13.333V5.417c0-.917-.75-1.667-1.666-1.667H9.583"
    ></path>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M11.667 1.667l-2.5 2.083 2.5 2.083M15.833 18.334a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM4.167 6.667v7.916c0 .917.75 1.667 1.666 1.667h4.584"
    ></path>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M8.333 18.333l2.5-2.083-2.5-2.084M4.167 6.667a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
    ></path>
  </svg>
);

export default SvgIntegration;
