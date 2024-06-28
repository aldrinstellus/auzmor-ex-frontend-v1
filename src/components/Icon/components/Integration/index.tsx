/* eslint-disable react/no-unknown-property */
import { SVGProps } from 'react';

const SvgIntegration = (
  props: SVGProps<SVGSVGElement> & { ariaLabel?: string },
) => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    aria-label={props.ariaLabel}
  >
    <path
      d="M6.91536 13.3327H8.91536C10.582 13.3327 11.2487 12.666 11.2487 10.9993V8.99935C11.2487 7.33268 10.582 6.66602 8.91536 6.66602H6.91536C5.2487 6.66602 4.58203 7.33268 4.58203 8.99935V10.9993C4.58203 12.666 5.2487 13.3327 6.91536 13.3327Z"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M14.168 16.6673H5.83464C2.5013 16.6673 1.66797 15.834 1.66797 12.5007V7.50065C1.66797 4.16732 2.5013 3.33398 5.83464 3.33398H14.168C17.5013 3.33398 18.3346 4.16732 18.3346 7.50065V12.5007C18.3346 15.834 17.5013 16.6673 14.168 16.6673Z"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export default SvgIntegration;
