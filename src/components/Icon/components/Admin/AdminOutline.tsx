import * as React from 'react';
import { SVGProps } from 'react';

interface IconProps {
  size?: number;
  fill?: string;
}

const SvgAdminOutline = ({
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
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9.16 10.87c-.1-.01-.22-.01-.33 0a4.42 4.42 0 0 1-4.27-4.43C4.56 3.99 6.54 2 9 2a4.435 4.435 0 0 1 .16 8.87ZM18.5 11a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z"
    />
    <path
      stroke={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15 10.826v-.652c0-.386.297-.705.665-.705.633 0 .892-.474.573-1.057a.728.728 0 0 1 .245-.96l.605-.367c.277-.174.634-.07.798.222l.038.07c.315.583.833.583 1.152 0l.038-.07c.164-.293.521-.396.797-.222l.606.367a.728.728 0 0 1 .245.96c-.319.583-.06 1.057.573 1.057.364 0 .665.315.665.705v.652c0 .386-.297.705-.665.705-.633 0-.892.474-.573 1.057.181.337.073.767-.245.96l-.605.367c-.277.174-.634.07-.798-.222l-.038-.07c-.315-.583-.833-.583-1.152 0l-.038.07c-.164.293-.521.396-.797.222l-.606-.367a.728.728 0 0 1-.245-.96c.319-.582.06-1.057-.573-1.057-.368 0-.665-.32-.665-.705ZM4.16 14.56c-2.42 1.62-2.42 4.26 0 5.87 2.75 1.84 7.26 1.84 10.01 0 2.42-1.62 2.42-4.26 0-5.87-2.74-1.83-7.25-1.83-10.01 0Z"
    />
  </svg>
);

export default SvgAdminOutline;
