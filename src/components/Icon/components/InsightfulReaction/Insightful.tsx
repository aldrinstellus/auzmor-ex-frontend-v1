import { SVGProps } from 'react';

const SvgInsightful = (
  props: SVGProps<SVGSVGElement> & { ariaLabel?: string },
) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    aria-label={props.ariaLabel}
  >
    <rect x="1" y="1" width="25.999" height="26" rx="12.9995" fill="#E3A008" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.2493 17.8992C16.2493 17.1134 16.4891 15.6901 17.0825 15.175C17.9547 14.4179 18.4992 13.3432 18.4992 12.1512C18.4992 9.85856 16.4847 8 13.9996 8C11.5145 8 9.5 9.85856 9.5 12.1512C9.5 13.3431 10.0445 14.4177 10.9165 15.1748C11.5099 15.69 11.7497 17.1134 11.7497 17.8992C11.7497 19.0455 12.757 19.9748 13.9995 19.9748C15.242 19.9748 16.2493 19.0455 16.2493 17.8992Z"
      fill="#FDF6B2"
    />
    <path
      d="M12.834 13.1401C13.0284 13.1914 13.4506 13.3554 13.5839 13.6014C13.7506 13.9089 13.9172 14.2933 14.0839 14.2933V14.2933C14.6632 14.2933 14.7171 13.1821 15.295 13.1415C15.3079 13.1406 15.3208 13.1401 15.3338 13.1401"
      stroke="#E3A008"
      strokeWidth="0.60074"
      strokeLinecap="round"
    />
    <ellipse
      cx="14.083"
      cy="15.2184"
      rx="0.249979"
      ry="0.230623"
      fill="#E3A008"
    />
    <path
      d="M16.1669 18.3701C14.9189 18.8887 12.7378 18.6417 11.834 18.3701C11.9244 19.2665 12.8282 19.9999 14.0935 19.9999C15.3588 19.9999 16.2521 18.8146 16.1669 18.3701Z"
      fill="#171717"
    />
    <rect
      x="13.166"
      y="18.8311"
      width="1.49987"
      height="0.307497"
      rx="0.153749"
      fill="white"
    />
    <rect
      x="1"
      y="1"
      width="25.999"
      height="26"
      rx="12.9995"
      stroke="white"
      strokeWidth="2"
    />
  </svg>
);

export default SvgInsightful;
