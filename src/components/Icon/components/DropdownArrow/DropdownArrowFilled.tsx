import * as React from 'react';
import { SVGProps } from 'react';

type IconProps = {
  size?: number;
  fill?: string;
};

const SvgDropdownArrowFilled = ({
  size = 14,
  fill = '#171717',
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 14 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.2787 0.96875L7.93208 5.31542C7.41875 5.82875 6.57875 5.82875 6.06542 5.31542L1.71875 0.96875"
      stroke="#171717"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgDropdownArrowFilled;
