import * as React from 'react';
import { SVGProps } from 'react';

const SvgLinkOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M2.7263 10C2.06797 9.20833 1.66797 8.19167 1.66797 7.08333C1.66797 4.56667 3.7263 2.5 6.2513 2.5H10.418C12.9346 2.5 15.0013 4.56667 15.0013 7.08333C15.0013 9.6 12.943 11.6667 10.418 11.6667H8.33464"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M17.275 10.0007C17.9333 10.7923 18.3333 11.809 18.3333 12.9173C18.3333 15.434 16.275 17.5007 13.75 17.5007H9.58333C7.06667 17.5007 5 15.434 5 12.9173C5 10.4007 7.05833 8.33398 9.58333 8.33398H11.6667"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export default SvgLinkOutline;
