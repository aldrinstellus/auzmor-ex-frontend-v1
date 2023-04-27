import * as React from 'react';
import { SVGProps } from 'react';

type IconProps = {
  size?: number;
  fill?: string;
};

const SvgClockFilled = ({
  size = 16,
  fill = '#737373',
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.472 10.1226L8.40536 8.88927C8.04536 8.67594 7.75203 8.1626 7.75203 7.7426V5.00927M14.6654 8.0026C14.6654 11.6826 11.6787 14.6693 7.9987 14.6693C4.3187 14.6693 1.33203 11.6826 1.33203 8.0026C1.33203 4.3226 4.3187 1.33594 7.9987 1.33594C11.6787 1.33594 14.6654 4.3226 14.6654 8.0026Z"
      stroke="#737373"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgClockFilled;
