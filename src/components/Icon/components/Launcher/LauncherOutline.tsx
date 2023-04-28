import * as React from 'react';
import { SVGProps } from 'react';

interface IconProps {
  size?: number;
  fill?: string;
}

const SvgLauncherOutline = ({
  size = 24,
  fill = '#737373',
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    {...props}
  >
    <path
      stroke={fill}
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m7.918 13.064-1.259-1.259a.593.593 0 0 1 0-.84c.366-.365.802-.589 1.238-.723 1.278-.393 2.687-.683 3.633-1.63l.584-.584C13.793 6.35 16.73 5.93 17.57 6.77c.839.839.42 3.776-1.26 5.455l-.584.584c-.946.946-1.236 2.355-1.63 3.633a2.952 2.952 0 0 1-.723 1.238.593.593 0 0 1-.839 0l-1.259-1.259m-3.357-3.357-.187.934a2.218 2.218 0 0 0 2.61 2.61l.934-.187m-3.357-3.357 3.357 3.357M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-7.787-1.873a.593.593 0 1 0 .839-.84.593.593 0 0 0-.84.84Z"
    />
  </svg>
);

export default SvgLauncherOutline;
