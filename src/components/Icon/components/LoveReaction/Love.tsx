import { SVGProps } from 'react';

const SvgLoveReaction = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect x="1" y="1" width="26" height="26" rx="13" fill="#F98080" />
    <path
      d="M18.1045 9.34811C16.942 8.82878 15.8356 9.13883 15.0469 9.59788C14.511 9.90977 13.7765 9.86198 13.2635 9.51379C11.831 8.5416 10.2368 9.15067 9.51511 9.67566C5.83198 12.7144 9.72126 16.6175 12.1263 18.1892L13.6482 19.1896C13.9405 19.3817 14.3048 19.3944 14.5986 19.2046C14.9129 19.0015 15.398 18.679 16.1118 18.1892C21.609 14.2599 20.3034 10.3304 18.1045 9.34811Z"
      fill="#FDE8E8"
    />
    <rect
      x="1"
      y="1"
      width="26"
      height="26"
      rx="13"
      stroke="white"
      strokeWidth="2"
    />
  </svg>
);

export default SvgLoveReaction;
