import { SVGProps } from 'react';

const SvgArrowSwapFilled = (
  props: SVGProps<SVGSVGElement> & { ariaLabel?: string },
) => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    {...props}
    aria-label={props.ariaLabel}
  ></svg>
);

export default SvgArrowSwapFilled;
