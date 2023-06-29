import * as React from 'react';
import { SVGProps } from 'react';

type IconProps = {
  size?: number;
  fill?: string;
};

const SvgInsightfulOutline = ({
  size = 16,
  fill = '#737373',
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.8984 20.7961C16.8984 19.2244 17.3781 16.3775 18.5649 15.3471C20.3093 13.8328 21.3984 11.6834 21.3984 9.29922C21.3984 4.71353 17.369 0.996094 12.3984 0.996094C7.42787 0.996094 3.39844 4.71353 3.39844 9.29922C3.39844 11.6834 4.4876 13.8328 6.23193 15.3471C7.41875 16.3775 7.89844 19.2244 7.89844 20.7961C7.89844 23.0889 9.91316 24.9477 12.3984 24.9477C14.8837 24.9477 16.8984 23.0889 16.8984 20.7961Z"
      fill="url(#paint0_linear_2416_20488)"
    />
    <path
      d="M10.0664 11.2773C10.4553 11.3799 11.2997 11.7079 11.5664 12.1999C11.8997 12.815 12.2331 13.5838 12.5664 13.5838C12.6445 13.5838 12.7435 13.5047 12.8501 13.3813C13.4521 12.6842 13.7738 11.6668 14.6409 11.3558C14.7778 11.3067 14.9208 11.2773 15.0664 11.2773"
      stroke="white"
      strokeWidth="0.60074"
      strokeLinecap="round"
    />
    <ellipse cx="12.5664" cy="15.4339" rx="0.5" ry="0.461285" fill="white" />
    <path
      d="M16.7331 21.7383C14.2367 22.7755 9.87415 22.2816 8.06641 21.7383C8.24718 23.5312 10.0549 24.9981 12.5858 24.9981C15.1166 24.9981 16.9033 22.6273 16.7331 21.7383Z"
      fill="#3C291D"
    />
    <rect
      x="10.7305"
      y="22.6602"
      width="3"
      height="0.615047"
      rx="0.307523"
      fill="white"
    />
    <defs>
      <linearGradient
        id="paint0_linear_2416_20488"
        x1="31.2318"
        y1="-11.1692"
        x2="15.3656"
        y2="15.672"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFC12B" />
        <stop offset="1" stopColor="#FFCA47" />
      </linearGradient>
    </defs>
  </svg>
);

export default SvgInsightfulOutline;
