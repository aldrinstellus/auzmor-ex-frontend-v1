import { SVGProps } from 'react';

const SvgUploadOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M2.66602 10.667V11.3337C2.66602 11.8641 2.87673 12.3728 3.2518 12.7479C3.62687 13.1229 4.13558 13.3337 4.66602 13.3337H11.3327C11.8631 13.3337 12.3718 13.1229 12.7469 12.7479C13.122 12.3728 13.3327 11.8641 13.3327 11.3337V10.667M10.666 5.33366L7.99935 2.66699M7.99935 2.66699L5.33268 5.33366M7.99935 2.66699V10.667"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgUploadOutline;
