import { SVGProps } from 'react';

const PostScheduleClockNotificationSVG = (props: SVGProps<SVGSVGElement>) => (
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
      fill="#1476CC"
      rx="10.5"
    ></rect>
    <rect width="21" height="21" x="0.5" y="0.5" stroke="#fff" rx="10.5"></rect>
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 11c0 2.76-2.24 5-5 5s-5-2.24-5-5 2.24-5 5-5 5 2.24 5 5z"
    ></path>
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12.855 12.589l-1.55-.925c-.27-.16-.49-.545-.49-.86v-2.05"
    ></path>
  </svg>
);

export default PostScheduleClockNotificationSVG;
