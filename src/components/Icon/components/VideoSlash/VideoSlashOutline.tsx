import { SVGProps } from 'react';

const SvgVideoSlashOutline = (
  props: SVGProps<SVGSVGElement> & { ariaLabel?: string },
) => (
  <svg
    width="56"
    height="56"
    viewBox="0 0 56 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    aria-label={props.ariaLabel}
  >
    <path
      d="M38.8034 17.6868C38.8034 17.6868 38.8734 15.4702 38.8034 14.7468C38.4067 9.98685 35.3034 8.35352 29.2134 8.35352H14.4901C7.11675 8.35352 4.66675 10.8035 4.66675 18.1768V37.8235C4.66675 40.7635 5.55341 43.7268 7.86341 45.6168L9.33341 46.6669"
      stroke="#737373"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M39.0599 25.5508V37.8241C39.0599 45.1974 36.6099 47.6474 29.2366 47.6474H16.9399"
      stroke="#737373"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M51.3334 15.7266V36.8899C51.3334 40.7866 48.7201 42.1399 45.5467 39.8999L39.0601 35.3499"
      stroke="#737373"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M51.38 5.10938L4.71338 51.776"
      stroke="#737373"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgVideoSlashOutline;
