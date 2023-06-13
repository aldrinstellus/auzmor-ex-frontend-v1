import * as React from 'react';
import { SVGProps } from 'react';
import { twConfig } from 'utils/misc';

interface IconProps {
  size?: number;
  stroke?: string;
}

const SvgFeedOutline = ({
  size = 24,
  stroke = '#737373',
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => (
  <>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...props}
      fill="none"
      className="hidden group-hover:block"
    >
      <path
        fill={twConfig.theme.colors.primary['500']}
        d="M7 10a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 0 3h-3A1.5 1.5 0 0 1 7 10Z"
      />
      <path
        fill={twConfig.theme.colors.primary['500']}
        fillRule="evenodd"
        d="M3 5.5v13a2 2 0 0 0 2 2h12L17.001 7H17V5.5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Zm5.5 2a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 0 0-5h-3Zm-2 8a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7Z"
        clipRule="evenodd"
      />
      <path
        fill={twConfig.theme.colors.primary['500']}
        d="M18.001 7 18 20.5h1a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-.999Z"
      />
    </svg>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...props}
      fill="none"
      className="group-hover:hidden"
    >
      <path
        stroke={stroke}
        strokeLinecap="round"
        strokeWidth={1.5}
        d="M17 7h2a2 2 0 0 1 2 2v9.5a2 2 0 0 1-2 2h-2M17 7v13.5M17 7V5.5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h12M6.5 16h7m-5-4h3a2 2 0 1 0 0-4h-3a2 2 0 1 0 0 4Z"
      />
    </svg>
  </>
);

export default SvgFeedOutline;
