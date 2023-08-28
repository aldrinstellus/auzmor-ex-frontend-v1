import * as React from 'react';
import { SVGProps } from 'react';

const SvgIconLinearOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    {...props}
  >
    <path
      d="M21.6806 16.9597L18.5506 9.64987C17.4906 7.16991 15.5407 7.06991 14.2307 9.42987L12.3407 12.8398C11.3807 14.5698 9.59077 14.7198 8.35079 13.1698L8.1308 12.8898C6.84082 11.2698 5.02085 11.4698 4.09087 13.3198L2.3709 16.7697C1.16092 19.1697 2.91089 21.9997 5.59084 21.9997H18.3506C20.9506 21.9997 22.7005 19.3497 21.6806 16.9597Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.97082 7.9999C8.62764 7.9999 9.97077 6.65677 9.97077 4.99995C9.97077 3.34312 8.62764 2 6.97082 2C5.31399 2 3.97087 3.34312 3.97087 4.99995C3.97087 6.65677 5.31399 7.9999 6.97082 7.9999Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgIconLinearOutline;
