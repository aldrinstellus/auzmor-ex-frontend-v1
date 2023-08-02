import * as React from 'react';
import { SVGProps } from 'react';
import { PRIMARY_COLOR } from 'utils/constants';

type IconProps = {
  size?: number;
  stroke?: string;
  hoveredStroke?: string;
};

const SvgImportOutline = ({
  size = 24,
  stroke = '#737373',
  hoveredStroke = PRIMARY_COLOR,
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => (
  <>
    {/* Hovered state*/}
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...props}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hidden group-hover:block"
    >
      <path
        d="M16.4405 8.8999C20.0405 9.2099 21.5105 11.0599 21.5105 15.1099V15.2399C21.5105 19.7099 19.7205 21.4999 15.2505 21.4999H8.74047C4.27047 21.4999 2.48047 19.7099 2.48047 15.2399V15.1099C2.48047 11.0899 3.93047 9.2399 7.47047 8.9099"
        stroke={hoveredStroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 2V14.88"
        stroke={hoveredStroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.3504 12.6499L12.0004 15.9999L8.65039 12.6499"
        stroke={hoveredStroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>

    {/* Normal state */}
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...props}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="group-hover:hidden"
    >
      <path
        d="M16.4405 8.8999C20.0405 9.2099 21.5105 11.0599 21.5105 15.1099V15.2399C21.5105 19.7099 19.7205 21.4999 15.2505 21.4999H8.74047C4.27047 21.4999 2.48047 19.7099 2.48047 15.2399V15.1099C2.48047 11.0899 3.93047 9.2399 7.47047 8.9099"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 2V14.88"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.3504 12.6499L12.0004 15.9999L8.65039 12.6499"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </>
);

export default SvgImportOutline;
