import { SVGProps } from 'react';

const PostLiveNotificationSVG = (props: SVGProps<SVGSVGElement>) => (
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
      fill="#12B44D"
      rx="10.5"
    ></rect>
    <rect width="21" height="21" x="0.5" y="0.5" stroke="#fff" rx="10.5"></rect>
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.875 11l1.415 1.415 2.835-2.83M11 16c2.75 0 5-2.25 5-5s-2.25-5-5-5-5 2.25-5 5 2.25 5 5 5z"
    ></path>
  </svg>
);

export default PostLiveNotificationSVG;
