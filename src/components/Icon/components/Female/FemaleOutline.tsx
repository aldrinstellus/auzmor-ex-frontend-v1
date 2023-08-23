/* eslint-disable react/no-unknown-property */
import * as React from 'react';
import { SVGProps } from 'react';

const SvgFemaleOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 16 16 "
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8.0026 10.6673C10.5799 10.6673 12.6693 8.57798 12.6693 6.00065C12.6693 3.42332 10.5799 1.33398 8.0026 1.33398C5.42528 1.33398 3.33594 3.42332 3.33594 6.00065C3.33594 8.57798 5.42528 10.6673 8.0026 10.6673Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 10.666V14.666"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 12.666H6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgFemaleOutline;
