import * as React from 'react';
import { SVGProps } from 'react';

type IconProps = {
  size?: number;
  fill?: string;
};

const SvgTrashFilled = ({
  size = 12,
  fill = '#737373',
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    fill="none"
  >
    <path
      d="M14 3.98958C11.78 3.76958 9.54667 3.65625 7.32 3.65625C6 3.65625 4.68 3.72292 3.36 3.85625L2 3.98958"
      stroke="#059669"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.66797 3.31594L5.81464 2.4426C5.9213 1.80927 6.0013 1.33594 7.12797 1.33594H8.87464C10.0013 1.33594 10.088 1.83594 10.188 2.44927L10.3346 3.31594"
      stroke="#059669"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.5669 6.09375L12.1336 12.8071C12.0603 13.8537 12.0003 14.6671 10.1403 14.6671H5.86026C4.00026 14.6671 3.94026 13.8537 3.86693 12.8071L3.43359 6.09375"
      stroke="#059669"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.88672 11H9.10672"
      stroke="#059669"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.33203 8.33594H9.66536"
      stroke="#059669"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgTrashFilled;
