import { SVGProps } from 'react';

const SvgFunnyOutline = (
  props: SVGProps<SVGSVGElement> & { ariaLabel?: string },
) => (
  <svg
    width="25"
    height="24"
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    aria-label={props.ariaLabel}
  >
    <circle cx="12.3984" cy="12" r="12" fill="#EBD187" />
    <path
      d="M6.65625 7.45798C7.2498 6.40084 9.04077 4.71512 11.4563 6.42941"
      stroke="#F5E497"
      strokeWidth="1.02857"
      strokeLinecap="round"
    />
    <path
      d="M6.3125 6.94236C6.96964 5.88521 8.9525 4.1995 11.6268 5.91378"
      stroke="#3D291E"
      strokeWidth="1.02857"
      strokeLinecap="round"
    />
    <path
      d="M13.4627 6.34704C14.4438 5.61707 16.8124 4.79722 18.4378 7.35761"
      stroke="#F5E497"
      strokeWidth="1.02857"
      strokeLinecap="round"
    />
    <path
      d="M13.4627 5.83141C14.4633 5.10978 16.8907 4.3151 18.5954 6.90944"
      stroke="#3D291E"
      strokeWidth="1.02857"
      strokeLinecap="round"
    />
    <path
      d="M19.9549 11.5555C12.6018 10.9072 6.86563 11.2925 4.76092 11.549C4.66903 11.5602 4.60492 11.6446 4.6151 11.7366C5.17999 16.8438 8.32562 18.9428 12.2262 19.1124C16.1225 19.2818 20.0188 16.1032 20.1103 11.727C20.1122 11.6383 20.0433 11.5633 19.9549 11.5555Z"
      fill="white"
      stroke="#624C41"
      strokeWidth="0.685714"
      strokeLinecap="round"
    />
  </svg>
);

export default SvgFunnyOutline;
