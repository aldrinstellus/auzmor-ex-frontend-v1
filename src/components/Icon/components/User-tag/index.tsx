import { SVGProps } from 'react';

const UserTagIcon = (props: SVGProps<SVGSVGElement>) => {
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
          <path
            stroke="currentColor"
            strokeMiterlimit="10"
            d="M12 12.573h-.507c-.533 0-1.04.207-1.413.58L8.94 14.28a1.348 1.348 0 01-1.887 0l-1.14-1.127a2.003 2.003 0 00-1.413-.58H4c-1.107 0-2-.886-2-1.98V3.32c0-1.094.893-1.98 2-1.98h8c1.107 0 2 .886 2 1.98v7.273c0 1.087-.893 1.98-2 1.98z"
          ></path>
          <g>
            <path
              stroke="currentColor"
              d="M8 6.665A1.553 1.553 0 108 3.56a1.553 1.553 0 000 3.106z"
            ></path>
            <path
              stroke="currentColor"
              d="M10.667 10.439c0-1.2-1.193-2.173-2.666-2.173-1.474 0-2.667.973-2.667 2.173"
            ></path>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default UserTagIcon;
