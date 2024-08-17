import { SVGProps } from 'react';

const SvgBrandingOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4.40524 15.5264L8.93524 20.0564C10.7952 21.9164 13.8152 21.9164 15.6852 20.0564L20.0752 15.6664C21.9352 13.8064 21.9352 10.7864 20.0752 8.91637L15.5352 4.39637C14.5852 3.44637 13.2752 2.93637 11.9352 3.00637L6.93524 3.24637C4.93524 3.33637 3.34524 4.92637 3.24524 6.91637L3.00524 11.9164C2.94524 13.2664 3.45524 14.5764 4.40524 15.5264Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.73535 12.2263C11.1161 12.2263 12.2354 11.107 12.2354 9.72632C12.2354 8.34561 11.1161 7.22632 9.73535 7.22632C8.35464 7.22632 7.23535 8.34561 7.23535 9.72632C7.23535 11.107 8.35464 12.2263 9.73535 12.2263Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M13.2354 17.2263L17.2354 13.2263"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgBrandingOutline;
