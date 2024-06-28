/* eslint-disable react/no-unknown-property */
import { SVGProps } from 'react';

const SvgBookmarkOutline = (
  props: SVGProps<SVGSVGElement> & { ariaLabel?: string },
) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    aria-label={props.ariaLabel}
  >
    <path
      d="M5.66667 2.66762H1M5 13.3343H1M3 8.00096H1M6.21333 8.85429H8.27333V13.6543C8.27333 14.361 9.15332 14.6943 9.61999 14.161L14.6667 8.42762C15.1067 7.92762 14.7533 7.14762 14.0867 7.14762H12.0267V2.34762C12.0267 1.64096 11.1467 1.30762 10.68 1.84096L5.63333 7.57429C5.2 8.07429 5.55333 8.85429 6.21333 8.85429Z"
      stroke="currentColor"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgBookmarkOutline;
