import * as React from 'react';
import { SVGProps } from 'react';

const SvgEyeFilled = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10.39 8a2.384 2.384 0 0 1-2.386 2.387A2.384 2.384 0 0 1 5.617 8a2.384 2.384 0 0 1 2.387-2.387A2.384 2.384 0 0 1 10.39 8Z"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8 13.513c2.353 0 4.547-1.386 6.073-3.786.6-.94.6-2.52 0-3.46C12.547 3.867 10.353 2.48 8 2.48S3.453 3.867 1.927 6.267c-.6.94-.6 2.52 0 3.46 1.526 2.4 3.72 3.786 6.073 3.786Z"
    />
  </svg>
);

export default SvgEyeFilled;
