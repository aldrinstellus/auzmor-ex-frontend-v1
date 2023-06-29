/* eslint-disable react/no-unknown-property */
import * as React from 'react';
import { SVGProps } from 'react';

type IconProps = {
  size?: number;
  fill?: string;
};

const SvgCakeOutline = ({
  size = 24,
  fill = '#737373',
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    {...props}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.33594 14.666H14.6693"
      stroke="#737373"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.07031 14.666V8.66602C2.07031 7.55935 3.06365 6.66602 4.29031 6.66602H11.697C12.9236 6.66602 13.917 7.55935 13.917 8.66602V14.666"
      stroke="#737373"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.70312 6.66732V4.78065C3.70312 3.98065 4.42312 3.33398 5.31646 3.33398H10.6831C11.5698 3.33398 12.2898 3.98065 12.2898 4.78065V6.66732"
      stroke="#737373"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.35156 9.32031L2.59823 9.32698C3.09156 9.33365 3.4849 9.73365 3.4849 10.227V10.447C3.4849 10.9403 3.8849 11.347 4.3849 11.347C4.87823 11.347 5.2849 10.947 5.2849 10.447V10.2403C5.2849 9.74698 5.6849 9.34031 6.1849 9.34031C6.67823 9.34031 7.0849 9.74031 7.0849 10.2403V10.447C7.0849 10.9403 7.4849 11.347 7.9849 11.347C8.47823 11.347 8.8849 10.947 8.8849 10.447V10.2403C8.8849 9.74698 9.2849 9.34031 9.7849 9.34031C10.2782 9.34031 10.6849 9.74031 10.6849 10.2403V10.447C10.6849 10.9403 11.0849 11.347 11.5849 11.347C12.0782 11.347 12.4849 10.947 12.4849 10.447V10.2403C12.4849 9.74698 12.8849 9.34031 13.3849 9.34031H13.6849"
      stroke="#737373"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.33594 3.33333V2"
      stroke="#737373"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.6641 3.33333V2"
      stroke="#737373"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 3.33398V1.33398"
      stroke="#737373"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgCakeOutline;
