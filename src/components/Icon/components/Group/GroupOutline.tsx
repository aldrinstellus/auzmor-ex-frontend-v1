import * as React from 'react';
import { SVGProps } from 'react';

const SvgGroupOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1.5 11H20.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13 1H9C8.73478 1 8.48043 1.10536 8.29289 1.29289C8.10536 1.48043 8 1.73478 8 2V6C8 6.26522 8.10536 6.51957 8.29289 6.70711C8.48043 6.89464 8.73478 7 9 7H13C13.2652 7 13.5196 6.89464 13.7071 6.70711C13.8946 6.51957 14 6.26522 14 6V2C14 1.73478 13.8946 1.48043 13.7071 1.29289C13.5196 1.10536 13.2652 1 13 1ZM7 15H3C2.73478 15 2.48043 15.1054 2.29289 15.2929C2.10536 15.4804 2 15.7348 2 16V20C2 20.2652 2.10536 20.5196 2.29289 20.7071C2.48043 20.8946 2.73478 21 3 21H7C7.26522 21 7.51957 20.8946 7.70711 20.7071C7.89464 20.5196 8 20.2652 8 20V16C8 15.7348 7.89464 15.4804 7.70711 15.2929C7.51957 15.1054 7.26522 15 7 15ZM19 15H15C14.7348 15 14.4804 15.1054 14.2929 15.2929C14.1054 15.4804 14 15.7348 14 16V20C14 20.2652 14.1054 20.5196 14.2929 20.7071C14.4804 20.8946 14.7348 21 15 21H19C19.2652 21 19.5196 20.8946 19.7071 20.7071C19.8946 20.5196 20 20.2652 20 20V16C20 15.7348 19.8946 15.4804 19.7071 15.2929C19.5196 15.1054 19.2652 15 19 15Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M11 11V7M17 15V11M5 15V11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgGroupOutline;
