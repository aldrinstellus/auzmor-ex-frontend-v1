import { SVGProps } from 'react';

const PlusIcon = (props: SVGProps<SVGSVGElement> & { ariaLabel?: string }) => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    aria-label={props.ariaLabel}
  >
    <rect width="16" height="16" rx="8" fill="currentColor" />
    <path
      d="M8 4V8M8 8V12M8 8H12M8 8H4"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default PlusIcon;
