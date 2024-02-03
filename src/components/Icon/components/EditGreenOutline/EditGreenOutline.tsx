import { SVGProps } from 'react';

const SvgEditOutlineV2 = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <rect width="24" height="24" fill="#059669" rx="12"></rect>
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      d="M11.927 7.366A4.084 4.084 0 0015.56 10.8M6 18.666h12M12.84 6.4l-5.473 5.793c-.207.22-.407.654-.447.954l-.247 2.16c-.086.78.474 1.313 1.247 1.18l2.147-.367c.3-.053.72-.274.926-.5l5.474-5.794c.946-1 1.373-2.14-.1-3.533-1.467-1.38-2.58-.893-3.527.107z"
    ></path>
  </svg>
);

export default SvgEditOutlineV2;
