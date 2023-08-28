import * as React from 'react';
import { SVGProps } from 'react';

const SvgReorderOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 10 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="2" cy="2" r="2" fill="currentColor" />
    <circle cx="2" cy="8" r="2" fill="currentColor" />
    <circle cx="2" cy="14" r="2" fill="currentColor" />
    <circle cx="8" cy="2" r="2" fill="currentColor" />
    <circle cx="8" cy="8" r="2" fill="currentColor" />
    <circle cx="8" cy="14" r="2" fill="currentColor" />
  </svg>
);

export default SvgReorderOutline;
