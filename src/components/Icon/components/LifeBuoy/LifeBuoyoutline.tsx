import { SVGProps } from 'react';

const SvgLifeBuoyOutline = (
  props: SVGProps<SVGSVGElement> & { ariaLabel?: string },
) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="none"
      viewBox="0 0 18 18"
      {...props}
      aria-label={props.ariaLabel}
    >
      <g>
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.644 14.25A7.477 7.477 0 009 16.5a7.478 7.478 0 005.356-2.25m-10.712 0A7.476 7.476 0 011.5 9c0-2.044.818-3.897 2.144-5.25m0 10.5l3.24-3.123M3.644 3.75A7.477 7.477 0 019 1.5c2.098 0 3.995.861 5.356 2.25m-10.712 0l3.24 3.123m7.472-3.123A7.476 7.476 0 0116.5 9a7.476 7.476 0 01-2.144 5.25m0-10.5l-3.24 3.123m3.24 7.377l-3.24-3.123M6.884 6.873A2.99 2.99 0 006 9c0 .831.338 1.584.884 2.127m0-4.254A2.99 2.99 0 019 6a2.99 2.99 0 012.116.873m0 0A2.99 2.99 0 0112 9a2.99 2.99 0 01-.884 2.127m0 0A2.99 2.99 0 019 12a2.99 2.99 0 01-2.116-.873"
        ></path>
      </g>
    </svg>
  );
};

export default SvgLifeBuoyOutline;
