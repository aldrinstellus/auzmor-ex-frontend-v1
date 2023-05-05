import * as React from 'react';
import { SVGProps } from 'react';

type IconProps = {
  size?: number;
  stroke?: string;
};

const SvgSendOutline = ({
  size = 24,
  stroke = '#737373',
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    fill="none"
  >
    <path
      d="M5.4412 11.9985H10.8411M9.51113 4.22865L18.071 8.50858C21.9109 10.4285 21.9109 13.5685 18.071 15.4885L9.51113 19.7684C3.75123 22.6483 1.40127 20.2884 4.28122 14.5385L5.1512 12.8085C5.3712 12.3685 5.3712 11.6385 5.1512 11.1985L4.28122 9.45856C1.40127 3.70866 3.76123 1.3487 9.51113 4.22865Z"
      stroke="#737373"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgSendOutline;
