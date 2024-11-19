import { SVGProps } from 'react';

const SvgDirFilled = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_119_216621)">
      <path
        d="M0 2.66602V17.666L1.74254 10.6959C2.1877 8.9152 3.78764 7.66602 5.62311 7.66602H17.75V5.66602C17.75 5.11372 17.3023 4.66602 16.75 4.66602H11.8735C10.6864 4.66602 9.56059 4.13872 8.80061 3.22675L8.69938 3.10528C7.93941 2.19331 6.81362 1.66602 5.6265 1.66602H1C0.447715 1.66602 0 2.11373 0 2.66602Z"
        fill="#FAD749"
      />
      <path d="M18 17.666L20 7.66602H2.40625L0 17.666H18Z" fill="#FBEBA3" />
    </g>
    <defs>
      <clipPath id="clip0_119_216621">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgDirFilled;
