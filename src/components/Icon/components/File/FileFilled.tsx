import { SVGProps } from 'react';

const SvgXlsFilled = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="32"
    fill="none"
    viewBox="0 0 24 32"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24 8.421V29.4735C24 30.869 22.8882 32 21.5172 32H2.48278C1.11135 32 0 30.869 0 29.4735V2.5265C0 1.131 1.11135 0 2.48278 0H15.7239L24 8.421Z"
      fill="#A3A3A3"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M23.9999 8.137V9.185H17.2344C15.8335 9.185 15.1875 8.025 15.1875 6.5945V0.1875H16.2122L23.9999 8.137Z"
      fill="#E5E5E5"
    />
  </svg>
);
export default SvgXlsFilled;
