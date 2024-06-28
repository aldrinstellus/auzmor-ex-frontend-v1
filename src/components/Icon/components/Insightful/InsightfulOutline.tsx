import { SVGProps } from 'react';

const SvgInsightfulOutline = (
  props: SVGProps<SVGSVGElement> & { ariaLabel?: string },
) => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 24 25"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    {...props}
    aria-label={props.ariaLabel}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.5 19.8C16.5 18.2283 16.9797 15.3814 18.1665 14.351C19.9108 12.8367 21 10.6873 21 8.30313C21 3.71744 16.9706 0 12 0C7.02944 0 3 3.71744 3 8.30313C3 10.6873 4.08917 12.8367 5.83349 14.351C7.02031 15.3814 7.5 18.2283 7.5 19.8C7.5 22.0928 9.51472 23.9516 12 23.9516C14.4853 23.9516 16.5 22.0928 16.5 19.8Z"
      fill="#E3A008"
    />
    <path
      d="M9.66699 10.2812C10.0559 10.3838 10.9003 10.7118 11.167 11.2038C11.5003 11.8189 11.8337 12.5877 12.167 12.5877C12.2451 12.5877 12.3441 12.5086 12.4506 12.3852C13.0527 11.6881 13.3744 10.6707 14.2415 10.3597C14.3783 10.3106 14.5213 10.2812 14.667 10.2812"
      stroke="white"
      strokeWidth="0.60074"
      strokeLinecap="round"
    />
    <ellipse cx="12.167" cy="14.4378" rx="0.5" ry="0.461285" fill="white" />
    <path
      d="M16.3337 20.7422C13.8373 21.7794 9.47474 21.2855 7.66699 20.7422C7.84777 22.5351 9.65551 24.0021 12.1864 24.0021C14.7172 24.0021 16.5039 21.6312 16.3337 20.7422Z"
      fill="#3C291D"
    />
    <rect
      x="10.333"
      y="21.6641"
      width="3"
      height="0.615047"
      rx="0.307523"
      fill="white"
    />
  </svg>
);

export default SvgInsightfulOutline;
