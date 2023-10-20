import { SVGProps } from 'react';

const SvgPlayFilled = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 4.28288C2 2.54899 3.99992 1.44983 5.63439 2.28543L20.7294 10.0025C22.4235 10.8686 22.4235 13.1314 20.7294 13.9975L5.63439 21.7146C3.99992 22.5502 2 21.451 2 19.7171V4.28288Z"
      fill="currentColor"
      stroke="currentColor"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgPlayFilled;
