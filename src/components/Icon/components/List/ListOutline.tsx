import { SVGProps } from 'react';

const SvgListOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M5.83333 3.16634H13.5V3.49967H5.83333V3.16634ZM2.5 2.83301H3.5V3.83301H2.5V2.83301ZM2.5 7.49967H3.5V8.49967H2.5V7.49967ZM2.5 12.1663H3.5V13.1663H2.5V12.1663ZM5.83333 7.83301H13.5V8.16634H5.83333V7.83301ZM5.83333 12.4997H13.5V12.833H5.83333V12.4997Z"
      fill={'currentColor'}
      stroke={'currentColor'}
    />
  </svg>
);

export default SvgListOutline;
