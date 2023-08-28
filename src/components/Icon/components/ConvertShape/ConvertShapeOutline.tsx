import * as React from 'react';
import { SVGProps } from 'react';

const SvgConvertShapeOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={12}
    height={12}
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    {...props}
  >
    <path
      d="M9.16406 13.457V15.707C9.16406 17.582 8.41406 18.332 6.53906 18.332H4.28906C2.41406 18.332 1.66406 17.582 1.66406 15.707V13.457C1.66406 11.582 2.41406 10.832 4.28906 10.832H6.53906C8.41406 10.832 9.16406 11.582 9.16406 13.457Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.3333 12.5C18.3333 15.725 15.725 18.3333 12.5 18.3333L13.375 16.875"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1.66406 7.5013C1.66406 4.2763 4.2724 1.66797 7.4974 1.66797L6.6224 3.1263"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.5859 9.16797C16.657 9.16797 18.3359 7.48904 18.3359 5.41797C18.3359 3.3469 16.657 1.66797 14.5859 1.66797C12.5149 1.66797 10.8359 3.3469 10.8359 5.41797C10.8359 7.48904 12.5149 9.16797 14.5859 9.16797Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgConvertShapeOutline;
