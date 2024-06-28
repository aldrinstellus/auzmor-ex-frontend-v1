import { SVGProps } from 'react';

const SvgStarFilled = (
  props: SVGProps<SVGSVGElement> & { ariaLabel?: string },
) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 17 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    aria-label={props.ariaLabel}
  >
    <path
      d="M4.38203 14.6667L5.46537 9.98333L1.83203 6.83333L6.63203 6.41667L8.4987 2L10.3654 6.41667L15.1654 6.83333L11.532 9.98333L12.6154 14.6667L8.4987 12.1833L4.38203 14.6667Z"
      fill="#FFB800"
    />
  </svg>
);

export default SvgStarFilled;
