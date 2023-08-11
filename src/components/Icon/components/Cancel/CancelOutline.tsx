import * as React from 'react';
import { SVGProps } from 'react';

type IconProps = {
  size?: number;
  stroke?: string;
};

const SvgCancelOutline = ({
  size = 24,
  stroke = '#F05252',
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 26 26"
    {...props}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="24" height="24" fill="#F5F5F5" />
    <g id="Custom">
      <path
        d="M-143 -99C-143 -100.105 -142.105 -101 -141 -101H1207C1208.1 -101 1209 -100.105 1209 -99V310C1209 311.105 1208.1 312 1207 312H-141C-142.105 312 -143 311.105 -143 310V-99Z"
        fill="#FAFAFA"
      />
      <g id="cs/linear/cancel">
        <g id="vuesax/linear/cancel">
          <g id="cancel">
            <path
              id="Vector"
              d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
              stroke={stroke}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              id="Vector_2"
              d="M6.00007 19.5001L10.58 14.83L19.5001 5.50009"
              stroke={stroke}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
      </g>
      <path
        d="M-141 -100H1207V-102H-141V-100ZM1208 -99V310H1210V-99H1208ZM1207 311H-141V313H1207V311ZM-142 310V-99H-144V310H-142ZM-141 311C-141.552 311 -142 310.552 -142 310H-144C-144 311.657 -142.657 313 -141 313V311ZM1208 310C1208 310.552 1207.55 311 1207 311V313C1208.66 313 1210 311.657 1210 310H1208ZM1207 -100C1207.55 -100 1208 -99.5523 1208 -99H1210C1210 -100.657 1208.66 -102 1207 -102V-100ZM-141 -102C-142.657 -102 -144 -100.657 -144 -99H-142C-142 -99.5523 -141.552 -100 -141 -100V-102Z"
        fill="black"
      />
    </g>
  </svg>
);

export default SvgCancelOutline;
