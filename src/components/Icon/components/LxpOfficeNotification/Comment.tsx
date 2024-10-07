import { SVGProps } from 'react';

const CommentNotificationSVG = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    fill="none"
    viewBox="0 0 22 22"
    {...props}
  >
    <rect
      width="21"
      height="21"
      x="0.5"
      y="0.5"
      fill="#171717"
      rx="10.5"
    ></rect>
    <rect width="21" height="21" x="0.5" y="0.5" stroke="#fff" rx="10.5"></rect>
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 10v2.5c0 2.5-1 3.5-3.5 3.5h-3C7 16 6 15 6 12.5v-3C6 7 7 6 9.5 6H12"
    ></path>
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 10h-2c-1.5 0-2-.5-2-2V6l4 4zM8.5 11.5h3M8.5 13.5h2"
    ></path>
  </svg>
);

export default CommentNotificationSVG;
