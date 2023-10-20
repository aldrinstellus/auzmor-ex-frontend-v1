import { SVGProps } from 'react';

const FacebookIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="24" height="24" rx="12" fill="#3B5998" />
      <g clipPath="url(#clip0_4044_156621)">
        <path
          d="M13.3346 12.9987H15.0013L15.668 10.332H13.3346V8.9987C13.3346 8.31203 13.3346 7.66536 14.668 7.66536H15.668V5.42536C15.4506 5.3967 14.63 5.33203 13.7633 5.33203C11.9533 5.33203 10.668 6.4367 10.668 8.46536V10.332H8.66797V12.9987H10.668V18.6654H13.3346V12.9987Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_4044_156621">
          <rect
            width="16"
            height="16"
            fill="white"
            transform="translate(4 4)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default FacebookIcon;
