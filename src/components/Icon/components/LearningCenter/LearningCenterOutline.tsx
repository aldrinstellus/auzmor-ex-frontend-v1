import { SVGProps } from 'react';

const SvgLauncherOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={18}
    height={18}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8.37461 2.10938L3.35795 5.38438C1.74961 6.43438 1.74961 8.78438 3.35795 9.83438L8.37461 13.1094C9.27461 13.701 10.7579 13.701 11.6579 13.1094L16.6496 9.83438C18.2496 8.78438 18.2496 6.44271 16.6496 5.39271L11.6579 2.11771C10.7579 1.51771 9.27461 1.51771 8.37461 2.10938Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M4.69258 10.8984L4.68424 14.8068C4.68424 15.8651 5.50091 16.9984 6.50091 17.3318L9.15924 18.2151C9.61758 18.3651 10.3759 18.3651 10.8426 18.2151L13.5009 17.3318C14.5009 16.9984 15.3176 15.8651 15.3176 14.8068V10.9401"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M17.832 12.5V7.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
);

export default SvgLauncherOutline;
