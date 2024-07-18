import { SVGProps } from 'react';

const SvgWebsiteOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      fill="#F5F5F5"
      stroke="#737373"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M8 14.667A6.667 6.667 0 108 1.333a6.667 6.667 0 000 13.334z"
    ></path>
    <path fill="#F5F5F5" d="M5.333 2H6a18.949 18.949 0 000 12h-.667"></path>
    <path
      stroke="#737373"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M5.333 2H6a18.949 18.949 0 000 12h-.667"
    ></path>
    <path fill="#F5F5F5" d="M10 2c1.3 3.893 1.3 8.107 0 12V2z"></path>
    <path
      stroke="#737373"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M10 2c1.3 3.893 1.3 8.107 0 12M2 10.667V10c3.893 1.3 8.107 1.3 12 0v.667M2 6c3.893-1.3 8.107-1.3 12 0"
    ></path>
  </svg>
);

export default SvgWebsiteOutline;
