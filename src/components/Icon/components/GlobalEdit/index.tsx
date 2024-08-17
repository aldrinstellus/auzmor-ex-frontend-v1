import { SVGProps } from 'react';

const GlobalEditIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <g>
        <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <g>
            <path
              stroke="currentColor"
              d="M14.667 7.999a6.67 6.67 0 00-6.666-6.667 6.67 6.67 0 00-6.667 6.667 6.67 6.67 0 006.667 6.666"
            ></path>
            <path
              stroke="currentColor"
              d="M5.334 2H6a18.949 18.949 0 000 12h-.666"
            ></path>
            <path
              stroke="currentColor"
              d="M10 2c.647 1.947.973 3.973.973 6"
            ></path>
            <path
              stroke="currentColor"
              d="M2 10.667V10c1.947.647 3.973.973 6 .973"
            ></path>
            <path
              stroke="currentColor"
              d="M2 5.998c3.893-1.3 8.107-1.3 12 0"
            ></path>
          </g>
          <g strokeMiterlimit="10">
            <path
              stroke="currentColor"
              d="M12.806 10.491l-2.36 2.36a.822.822 0 00-.2.394l-.127.9c-.046.326.18.553.507.506l.9-.126a.793.793 0 00.393-.2l2.36-2.36c.407-.407.6-.88 0-1.48-.593-.594-1.066-.4-1.473.006z"
            ></path>
            <path
              stroke="currentColor"
              d="M12.467 10.832c.2.72.76 1.28 1.48 1.48"
            ></path>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default GlobalEditIcon;
