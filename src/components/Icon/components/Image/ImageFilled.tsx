import * as React from 'react';
import { SVGProps } from 'react';

type IconProps = {
  size?: number;
  fill?: string;
};

const SvgImageFilled = ({
  size = 24,
  fill = '#737373',
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...props}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.02 16.82L18.89 9.5C18.32 8.16 17.47 7.4 16.5 7.35C15.54 7.3 14.61 7.97 13.9 9.25L12 12.66C11.6 13.38 11.03 13.81 10.41 13.86C9.78 13.92 9.15 13.59 8.64 12.94L8.42 12.66C7.71 11.77 6.83 11.34 5.93 11.43C5.03 11.52 4.26 12.14 3.75 13.15L2.02 16.6C1.4 17.85 1.46 19.3 2.19 20.48C2.92 21.66 4.19 22.37 5.58 22.37H18.34C19.68 22.37 20.93 21.7 21.67 20.58C22.43 19.46 22.55 18.05 22.02 16.82Z"
      fill={fill}
    />
    <path
      d="M6.97 8.38C8.83672 8.38 10.35 6.86673 10.35 5C10.35 3.13328 8.83672 1.62 6.97 1.62C5.10328 1.62 3.59 3.13328 3.59 5C3.59 6.86673 5.10328 8.38 6.97 8.38Z"
      fill={fill}
    />
  </svg>
);

export default SvgImageFilled;
