import { SVGProps } from 'react';

const SvgMessageQuestionOutline = (
  props: SVGProps<SVGSVGElement> & { ariaLabel?: string },
) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
      {...props}
      aria-label={props.ariaLabel}
    >
      <g>
        <g
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.2"
        >
          <path
            strokeMiterlimit="10"
            d="M14.167 15.358h-3.334l-3.708 2.467a.83.83 0 01-1.292-.692v-1.775c-2.5 0-4.166-1.666-4.166-4.166v-5c0-2.5 1.666-4.167 4.166-4.167h8.334c2.5 0 4.166 1.667 4.166 4.167v5c0 2.5-1.666 4.166-4.166 4.166z"
          ></path>
          <path d="M10 9.467v-.175c0-.567.35-.867.7-1.109.342-.233.683-.533.683-1.083A1.38 1.38 0 0010 5.717 1.38 1.38 0 008.617 7.1"></path>
          <path d="M9.996 11.458h.008"></path>
        </g>
      </g>
    </svg>
  );
};

export default SvgMessageQuestionOutline;
