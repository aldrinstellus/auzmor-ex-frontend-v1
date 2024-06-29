import { SVGProps } from 'react';

const SvgCloudAddOutline = (
  props: SVGProps<SVGSVGElement> & { ariaLabel?: string },
) => (
  <svg
    width={120}
    height={120}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    aria-label={props.ariaLabel}
  >
    <path
      d="M27.6994 55.5996C4.29941 57.2496 4.29941 91.2996 27.6994 92.9496H37.2996"
      stroke="#10B981"
      strokeWidth="3"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M27.9501 55.5997C11.9001 10.9497 79.5999 -6.90025 87.3499 39.9998C109 42.7498 117.75 71.5998 101.35 85.9498C96.3501 90.4998 89.9 92.9997 83.15 92.9497H82.6999"
      stroke="#10B981"
      strokeWidth="3"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M85 82.6499C85 86.3499 84.1999 89.8499 82.6999 92.9499C82.2999 93.8499 81.8501 94.6999 81.3501 95.4999C77.0501 102.75 69.1 107.65 60 107.65C50.9 107.65 42.9499 102.75 38.6499 95.4999C38.1499 94.6999 37.7001 93.8499 37.3001 92.9499C35.8001 89.8499 35 86.3499 35 82.6499C35 68.8499 46.2 57.6499 60 57.6499C73.8 57.6499 85 68.8499 85 82.6499Z"
      stroke="#10B981"
      strokeWidth="3"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M52.2002 82.65L57.1501 87.6L67.8002 77.75"
      stroke="#10B981"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgCloudAddOutline;
