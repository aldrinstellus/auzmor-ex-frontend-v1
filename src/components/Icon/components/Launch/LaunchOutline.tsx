import { SVGProps } from 'react';

const SvgLaunchOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12.75 11.2496L18.9 5.09961"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.4984 8.1V4.5H15.8984"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.25 4.5H9.75C6 4.5 4.5 6 4.5 9.75V14.25C4.5 18 6 19.5 9.75 19.5H14.25C18 19.5 19.5 18 19.5 14.25V12.75"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgLaunchOutline;
