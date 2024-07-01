import { SVGProps } from 'react';

const SvgAddCircleFilled = (
  props: SVGProps<SVGSVGElement> & { ariaLabel?: string },
) => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    {...props}
    aria-label={props.ariaLabel}
  >
    <path
      d="M8.0026 14.6654C11.6693 14.6654 14.6693 11.6654 14.6693 7.9987C14.6693 4.33203 11.6693 1.33203 8.0026 1.33203C4.33594 1.33203 1.33594 4.33203 1.33594 7.9987C1.33594 11.6654 4.33594 14.6654 8.0026 14.6654Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.33594 8H10.6693"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 10.6654V5.33203"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgAddCircleFilled;
