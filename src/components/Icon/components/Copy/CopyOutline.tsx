/* eslint-disable react/no-unknown-property */
import * as React from 'react';
import { SVGProps } from 'react';

type IconProps = {
  size?: number;
  fill?: string;
};

const SvgCopyOutline = ({
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
      d="M14.6693 13.1632V15.9632C14.6693 18.2965 13.7359 19.2298 11.4026 19.2298H8.6026C6.26927 19.2298 5.33594 18.2965 5.33594 15.9632V13.1632C5.33594 10.8298 6.26927 9.89648 8.6026 9.89648H11.4026C13.7359 9.89648 14.6693 10.8298 14.6693 13.1632Z"
      stroke="#10B981"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M18.6693 9.16315V11.9632C18.6693 14.2965 17.7359 15.2298 15.4026 15.2298H14.6693V13.1632C14.6693 10.8298 13.7359 9.89648 11.4026 9.89648H9.33594V9.16315C9.33594 6.82982 10.2693 5.89648 12.6026 5.89648H15.4026C17.7359 5.89648 18.6693 6.82982 18.6693 9.16315Z"
      stroke="#10B981"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export default SvgCopyOutline;
