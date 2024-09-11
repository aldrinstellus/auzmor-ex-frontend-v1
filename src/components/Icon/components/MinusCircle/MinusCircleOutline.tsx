import { SVGProps } from 'react';

const SvgMinusCircleOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <g>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12.5 10h-5m10 0a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
      ></path>
    </g>
  </svg>
);

export default SvgMinusCircleOutline;
