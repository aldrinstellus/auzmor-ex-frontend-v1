import { SVGProps } from 'react';

const StarShoutOutNotificationSVG = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    fill="none"
    viewBox="0 0 22 22"
    {...props}
  >
    <rect width="21" height="21" x="0.5" y="0.5" fill="#F36" rx="10.5"></rect>
    <rect width="21" height="21" x="0.5" y="0.5" stroke="#fff" rx="10.5"></rect>
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.865 6.755l.88 1.76c.12.245.44.48.71.525l1.595.265c1.02.17 1.26.91.525 1.64l-1.24 1.24c-.21.21-.325.615-.26.905l.355 1.535c.28 1.215-.365 1.685-1.44 1.05l-1.495-.885c-.27-.16-.715-.16-.99 0l-1.495.885c-1.07.635-1.72.16-1.44-1.05l.355-1.535c.065-.29-.05-.695-.26-.905l-1.24-1.24c-.73-.73-.495-1.47.525-1.64l1.595-.265c.265-.045.585-.28.705-.525l.88-1.76c.48-.955 1.26-.955 1.735 0z"
    ></path>
  </svg>
);

export default StarShoutOutNotificationSVG;
