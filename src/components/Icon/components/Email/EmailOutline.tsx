/* eslint-disable react/no-unknown-property */
import * as React from 'react';
import { SVGProps } from 'react';

type IconProps = {
  size?: number;
  fill?: string;
};

const SvgEmailOutline = ({
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
    <rect x="0.5" y="1.0625" width="23" height="23" rx="3.5" fill="#FAFAFA" />
    <path
      d="M15.3359 18.2298H8.66927C6.66927 18.2298 5.33594 17.2298 5.33594 14.8965V10.2298C5.33594 7.89648 6.66927 6.89648 8.66927 6.89648H15.3359C17.3359 6.89648 18.6693 7.89648 18.6693 10.2298V14.8965C18.6693 17.2298 17.3359 18.2298 15.3359 18.2298Z"
      stroke="#737373"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M15.3307 10.5625L13.2441 12.2292C12.5574 12.7758 11.4307 12.7758 10.7441 12.2292L8.66406 10.5625"
      stroke="#737373"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <rect x="0.5" y="1.0625" width="23" height="23" rx="3.5" stroke="#E5E5E5" />
  </svg>
);

export default SvgEmailOutline;
