import { SVGProps } from 'react';

const SvgVideoSquareOutline = (
  props: SVGProps<SVGSVGElement> & { ariaLabel?: string },
) => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    aria-label={props.ariaLabel}
  >
    <path
      d="M5.99992 15.5556H9.99992C13.3333 15.5556 14.6666 14.2223 14.6666 10.889V6.88896C14.6666 3.55562 13.3333 2.22229 9.99992 2.22229H5.99992C2.66659 2.22229 1.33325 3.55562 1.33325 6.88896V10.889C1.33325 14.2223 2.66659 15.5556 5.99992 15.5556Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.06665 8.88891V7.90224C6.06665 6.62891 6.96665 6.11558 8.06665 6.74891L8.91998 7.24224L9.77332 7.73558C10.8733 8.36891 10.8733 9.40891 9.77332 10.0422L8.91998 10.5356L8.06665 11.0289C6.96665 11.6622 6.06665 11.1422 6.06665 9.87558V8.88891Z"
      stroke="currentColor"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgVideoSquareOutline;
