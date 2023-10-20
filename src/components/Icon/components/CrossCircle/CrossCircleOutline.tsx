import { SVGProps } from 'react';

const SvgCrossCircleOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    {...props}
  >
    <path
      d="M7.9987 14.6693C11.6654 14.6693 14.6654 11.6693 14.6654 8.0026C14.6654 4.33594 11.6654 1.33594 7.9987 1.33594C4.33203 1.33594 1.33203 4.33594 1.33203 8.0026C1.33203 11.6693 4.33203 14.6693 7.9987 14.6693Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.11328 9.89052L9.88661 6.11719"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.88661 9.89052L6.11328 6.11719"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgCrossCircleOutline;
