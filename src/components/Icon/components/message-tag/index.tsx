import { SVGProps } from 'react';

const MessageTagIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <g>
        <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.667 1.332H5.334c-2.667 0-4 1.333-4 4v8.667c0 .366.3.666.667.666h8.666c2.667 0 4-1.333 4-4V5.332c0-2.667-1.333-4-4-4z"></path>
          <g strokeMiterlimit="10">
            <path stroke="currentColor" d="M4.666 6.332h6.667"></path>
            <path stroke="currentColor" d="M4.666 9.664h4.667"></path>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default MessageTagIcon;
