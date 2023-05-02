/* eslint-disable react/no-unknown-property */
import * as React from 'react';
import { SVGProps } from 'react';

type IconProps = {
  size?: number;
  fill?: string;
};

const SvgAnalyticsIconOutline = ({
  size = 24,
  fill = '#737373',
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    {...props}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.66406 18.3346H18.3307M8.1224 3.33464V18.3346H11.8724V3.33464C11.8724 2.41797 11.4974 1.66797 10.3724 1.66797H9.6224C8.4974 1.66797 8.1224 2.41797 8.1224 3.33464ZM2.4974 8.33464V18.3346H5.83073V8.33464C5.83073 7.41797 5.4974 6.66797 4.4974 6.66797H3.83073C2.83073 6.66797 2.4974 7.41797 2.4974 8.33464ZM14.1641 12.5013V18.3346H17.4974V12.5013C17.4974 11.5846 17.1641 10.8346 16.1641 10.8346H15.4974C14.4974 10.8346 14.1641 11.5846 14.1641 12.5013Z"
      stroke="#171717"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export default SvgAnalyticsIconOutline;
