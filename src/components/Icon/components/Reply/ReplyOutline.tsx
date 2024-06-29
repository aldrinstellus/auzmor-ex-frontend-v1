import { SVGProps } from 'react';

const SvgReplyOutline = (
  props: SVGProps<SVGSVGElement> & { ariaLabel?: string },
) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    {...props}
    aria-label={props.ariaLabel}
  >
    <path
      d="M5.9987 14.6654H9.9987C13.332 14.6654 14.6654 13.332 14.6654 9.9987V5.9987C14.6654 2.66536 13.332 1.33203 9.9987 1.33203H5.9987C2.66536 1.33203 1.33203 2.66536 1.33203 5.9987V9.9987C1.33203 13.332 2.66536 14.6654 5.9987 14.6654Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.00286 10.2512H9.28286C10.4162 10.2512 11.3362 9.3312 11.3362 8.19787C11.3362 7.06453 10.4162 6.14453 9.28286 6.14453H4.76953"
      stroke="currentColor"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.71464 7.17812L4.66797 6.12479L5.71464 5.07812"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgReplyOutline;
