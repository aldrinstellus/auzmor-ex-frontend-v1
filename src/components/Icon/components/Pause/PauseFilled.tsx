import { SVGProps } from 'react';

const SvgPauseFilled = (
  props: SVGProps<SVGSVGElement> & { ariaLabel?: string },
) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 46 46"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    aria-label={props.ariaLabel}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.9375 10.0625C12.9375 9.26859 13.5811 8.625 14.375 8.625H17.25C18.0439 8.625 18.6875 9.26859 18.6875 10.0625V35.9375C18.6875 36.7314 18.0439 37.375 17.25 37.375H14.375C13.9938 37.375 13.6281 37.2236 13.3585 36.954C13.089 36.6844 12.9375 36.3187 12.9375 35.9375L12.9375 10.0625ZM27.3125 10.0625C27.3125 9.26859 27.9561 8.625 28.75 8.625H31.625C32.0063 8.625 32.3719 8.77645 32.6415 9.04603C32.9111 9.31562 33.0625 9.68125 33.0625 10.0625L33.0625 35.9375C33.0625 36.7314 32.4189 37.375 31.625 37.375H28.75C27.9561 37.375 27.3125 36.7314 27.3125 35.9375V10.0625Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgPauseFilled;
