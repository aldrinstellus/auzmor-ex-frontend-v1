import { SVGProps } from 'react';

const SvgFunny = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" fill="#FFEDD5" />
    <circle
      cx="10"
      cy="10"
      r="5.7"
      fill="#F5DB95"
      stroke="#624C41"
      strokeWidth="0.6"
    />
    <path
      d="M7.12891 7.72899C7.42568 7.20042 8.32116 6.35756 9.52891 7.2147"
      stroke="#F5E497"
      strokeWidth="1.02857"
      strokeLinecap="round"
    />
    <path
      d="M6.95703 7.47118C7.2856 6.94261 8.27703 6.09975 9.61417 6.95689"
      stroke="#624C41"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.5321 7.17352C11.0227 6.80853 12.207 6.39861 13.0197 7.6788"
      stroke="#F5E497"
      strokeWidth="1.02857"
      strokeLinecap="round"
    />
    <path
      d="M10.5321 6.91571C11.0324 6.55489 12.2461 6.15755 13.0985 7.45472"
      stroke="#624C41"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.7019 9.77288C10.1542 9.46617 7.37066 9.63989 6.2651 9.76677C6.17314 9.77732 6.10861 9.8608 6.11991 9.95268C6.42684 12.4465 7.98667 13.4743 9.91585 13.5581C11.8407 13.6418 13.7655 12.0913 13.8554 9.94369C13.8591 9.85504 13.7903 9.78052 13.7019 9.77288Z"
      fill="white"
      stroke="#624C41"
      strokeWidth="0.685714"
      strokeLinecap="round"
    />
    <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" stroke="white" />
  </svg>
);

export default SvgFunny;
