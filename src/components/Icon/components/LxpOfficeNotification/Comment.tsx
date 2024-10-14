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
      strokeMiterlimit="10"
      d="M9.25 14.5H9c-2 0-3-.5-3-3V9c0-2 1-3 3-3h4c2 0 3 1 3 3v2.5c0 2-1 3-3 3h-.25a.507.507 0 00-.4.2l-.75 1c-.33.44-.87.44-1.2 0l-.75-1a.565.565 0 00-.4-.2z"
    ></path>
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12.998 10.5h.005M10.997 10.5h.005M8.997 10.5h.005"
    ></path>
  </svg>
);

export default CommentNotificationSVG;
