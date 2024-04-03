import { SVGProps } from 'react';

const SvgShoppingCartOutline = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
      {...props}
    >
      <g>
        <g
          stroke="#737373"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="1.2"
        >
          <path d="M1.667 1.667h1.45c.9 0 1.608.775 1.533 1.666l-.692 8.3a2.33 2.33 0 002.325 2.525h8.875c1.2 0 2.25-.983 2.342-2.175l.45-6.25c.1-1.383-.95-2.508-2.342-2.508H4.85"></path>
          <path d="M13.542 18.333a1.042 1.042 0 100-2.083 1.042 1.042 0 000 2.083z"></path>
          <path d="M6.875 18.333a1.042 1.042 0 100-2.083 1.042 1.042 0 000 2.083z"></path>
          <path d="M7.5 6.667h10"></path>
        </g>
      </g>
    </svg>
  );
};

export default SvgShoppingCartOutline;
