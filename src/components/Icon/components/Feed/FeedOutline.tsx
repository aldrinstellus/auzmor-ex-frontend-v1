import { SVGProps } from 'react';

const SvgFeedOutline = (
  props: SVGProps<SVGSVGElement> & { ariaLabel?: string },
) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    aria-label={props.ariaLabel}
  >
    <path
      d="M17 7H19C20.1046 7 21 7.89543 21 9V18.5C21 19.6046 20.1046 20.5 19 20.5H17M17 7V20.5M17 7V5.5C17 4.39543 16.1046 3.5 15 3.5H5C3.89543 3.5 3 4.39543 3 5.5V18.5C3 19.6046 3.89543 20.5 5 20.5H17M6.5 16H13.5M8.5 12H11.5C12.6046 12 13.5 11.1046 13.5 10C13.5 8.89543 12.6046 8 11.5 8H8.5C7.39543 8 6.5 8.89543 6.5 10C6.5 11.1046 7.39543 12 8.5 12Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export default SvgFeedOutline;
