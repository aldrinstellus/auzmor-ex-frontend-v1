import { SVGProps } from 'react';

const SvgCloseFilled = (
  props: SVGProps<SVGSVGElement> & { ariaLabel?: string },
) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    aria-label={props.ariaLabel}
  >
    <g clipPath="url(#clip0_478_4521)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 0C1.79086 0 0 1.79086 0 4V20C0 22.2091 1.79086 24 4 24H20C22.2091 24 24 22.2091 24 20V4C24 1.79086 22.2091 0 20 0H4ZM5.53033 3.96967C5.23744 3.67678 4.76256 3.67678 4.46967 3.96967C4.17678 4.26256 4.17678 4.73744 4.46967 5.03033L11.4393 12L4.46967 18.9697C4.17678 19.2626 4.17678 19.7374 4.46967 20.0303C4.76256 20.3232 5.23744 20.3232 5.53033 20.0303L12.5 13.0607L19.4697 20.0303C19.7626 20.3232 20.2374 20.3232 20.5303 20.0303C20.8232 19.7374 20.8232 19.2626 20.5303 18.9697L13.5607 12L19.9748 5.58589C20.2677 5.29299 20.2677 4.81812 19.9748 4.52523C19.6819 4.23233 19.207 4.23233 18.9141 4.52523L12.5 10.9393L5.53033 3.96967Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_478_4521">
        <rect width="24" height="24" rx="4" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgCloseFilled;
