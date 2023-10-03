import { SVGProps } from 'react';

const SvgUsersOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15.41 3c1.94 0 3.5 1.57 3.5 3.5 0 1.89-1.5 3.43-3.37 3.5a1.13 1.13 0 0 0-.26 0m2.06 9c.72-.15 1.4-.44 1.96-.87 1.56-1.17 1.56-3.1 0-4.27-.55-.42-1.22-.7-1.93-.86M8.16 9.87c-.1-.01-.22-.01-.33 0a4.42 4.42 0 0 1-4.27-4.43C3.56 2.99 5.54 1 8 1a4.435 4.435 0 0 1 .16 8.87Zm-5 3.69c-2.42 1.62-2.42 4.26 0 5.87 2.75 1.84 7.26 1.84 10.01 0 2.42-1.62 2.42-4.26 0-5.87-2.74-1.83-7.25-1.83-10.01 0Z"
    />
  </svg>
);

export default SvgUsersOutline;
