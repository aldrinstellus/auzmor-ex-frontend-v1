import { SVGProps } from 'react';

const LockOpenIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      {...props}
      viewBox="0 0 16 16"
    >
      <g>
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5.333 7.333V4.667a2.667 2.667 0 115.333 0M7.999 10v1.333M4 14h8a1.334 1.334 0 001.334-1.333v-4a1.334 1.334 0 00-1.334-1.334H4a1.333 1.333 0 00-1.333 1.334v4A1.333 1.333 0 003.999 14z"
        ></path>
      </g>
    </svg>
  );
};

export default LockOpenIcon;
