import { SVGProps } from 'react';

const SvgTeacherOutline = (
  props: SVGProps<SVGSVGElement> & { ariaLabel?: string },
) => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 17 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    aria-label={props.ariaLabel}
  >
    <path
      d="M7.20001 1.68666L3.18668 4.30666C1.90001 5.14666 1.90001 7.02666 3.18668 7.86666L7.20001 10.4867C7.92001 10.96 9.10668 10.96 9.82668 10.4867L13.82 7.86666C15.1 7.02666 15.1 5.15333 13.82 4.31333L9.82668 1.69333C9.10668 1.21333 7.92001 1.21333 7.20001 1.68666Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.25325 8.72L4.24658 11.8467C4.24658 12.6933 4.89992 13.6 5.69992 13.8667L7.82658 14.5733C8.19325 14.6933 8.79992 14.6933 9.17325 14.5733L11.2999 13.8667C12.0999 13.6 12.7532 12.6933 12.7532 11.8467V8.75333"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.7666 10V6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgTeacherOutline;
