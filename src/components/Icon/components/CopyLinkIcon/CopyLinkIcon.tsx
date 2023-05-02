/* eslint-disable react/no-unknown-property */
import * as React from 'react';
import { SVGProps } from 'react';

type IconProps = {
  size?: number;
  fill?: string;
};

const SvgCopyLinkIconOutline = ({
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
      d="M2.72239 10C2.06406 9.20833 1.66406 8.19167 1.66406 7.08333C1.66406 4.56667 3.7224 2.5 6.2474 2.5H10.4141C12.9307 2.5 14.9974 4.56667 14.9974 7.08333C14.9974 9.6 12.9391 11.6667 10.4141 11.6667H8.33073"
      stroke="#171717"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M17.275 9.9987C17.9333 10.7904 18.3333 11.807 18.3333 12.9154C18.3333 15.432 16.275 17.4987 13.75 17.4987H9.58333C7.06667 17.4987 5 15.432 5 12.9154C5 10.3987 7.05833 8.33203 9.58333 8.33203H11.6667"
      stroke="#171717"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export default SvgCopyLinkIconOutline;
