import { SVGProps } from 'react';

const SvgColumnSelectorOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M2 4.66669H14" stroke="currentColor" strokeLinecap="round" />
    <path d="M4 8H12" stroke="currentColor" strokeLinecap="round" />
    <path
      d="M6.66663 11.3333H9.33329"
      stroke="currentColor"
      strokeLinecap="round"
    />
  </svg>
);

export default SvgColumnSelectorOutline;
