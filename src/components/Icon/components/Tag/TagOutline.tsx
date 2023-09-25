import { SVGProps } from 'react';

const SvgTagOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M2.78001 10.2005L5.80001 13.2205C7.04001 14.4605 9.05334 14.4605 10.3 13.2205L13.2267 10.2939C14.4667 9.05385 14.4667 7.04052 13.2267 5.79385L10.2 2.78052C9.56668 2.14719 8.69334 1.80719 7.80001 1.85385L4.46668 2.01385C3.13334 2.07385 2.07334 3.13385 2.00668 4.46052L1.84668 7.79385C1.80668 8.69385 2.14668 9.56719 2.78001 10.2005Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.33317 8.00033C7.25365 8.00033 7.99984 7.25413 7.99984 6.33366C7.99984 5.41318 7.25365 4.66699 6.33317 4.66699C5.4127 4.66699 4.6665 5.41318 4.6665 6.33366C4.6665 7.25413 5.4127 8.00033 6.33317 8.00033Z"
      stroke="currentColor"
      strokeLinecap="round"
    />
  </svg>
);

export default SvgTagOutline;
