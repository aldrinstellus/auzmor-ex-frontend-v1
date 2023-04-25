import * as React from 'react';
import { SVGProps } from 'react';

interface IconProps {
  size?: number;
}

const SvgHomeOutline = ({
  size = 24,
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox={`0 0 ${size} ${25}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12.5 18V15"
      stroke="#737373"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.5732 2.82376L3.64319 8.37376C2.86319 8.99376 2.36319 10.3038 2.53319 11.2838L3.86319 19.2438C4.10319 20.6638 5.46319 21.8138 6.90319 21.8138H18.1032C19.5332 21.8138 20.9032 20.6538 21.1432 19.2438L22.4732 11.2838C22.6332 10.3038 22.1332 8.99376 21.3632 8.37376L14.4332 2.83376C13.3632 1.97376 11.6332 1.97376 10.5732 2.82376Z"
      stroke="#737373"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgHomeOutline;
