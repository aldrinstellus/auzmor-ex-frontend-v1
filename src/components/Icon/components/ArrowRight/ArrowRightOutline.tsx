import { SVGProps } from 'react';

const SvgArrowRightOutline = (
  props: SVGProps<SVGSVGElement> & { ariaLabel?: string },
) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    aria-label={props.ariaLabel}
  >
    <path
      d="M8.91 19.92L15.43 13.4C16.2 12.63 16.2 11.37 15.43 10.6L8.91 4.08"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgArrowRightOutline;
