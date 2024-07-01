import { SVGProps } from 'react';

const SvgCloseOutline = (
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
      d="M4 20.5L12.5 12M12.5 12L20.3704 4.12963M12.5 12L4 3.5M12.5 12L21 20.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export default SvgCloseOutline;
