import { SVGProps } from 'react';

const EmployeeTagIcon = (
  props: SVGProps<SVGSVGElement> & { ariaLabel?: string },
) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      aria-label={props.ariaLabel}
    >
      <path
        d="M12 12.5732H11.4933C10.96 12.5732 10.4533 12.7798 10.08 13.1532L8.93998 14.2798C8.41998 14.7932 7.57334 14.7932 7.05334 14.2798L5.91333 13.1532C5.54 12.7798 5.02667 12.5732 4.5 12.5732H4C2.89333 12.5732 2 11.6865 2 10.5932V3.31982C2 2.22649 2.89333 1.33984 4 1.33984H12C13.1067 1.33984 14 2.22649 14 3.31982V10.5932C14 11.6798 13.1067 12.5732 12 12.5732Z"
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.99866 6.66524C8.85654 6.66524 9.552 5.96978 9.552 5.1119C9.552 4.25402 8.85654 3.55859 7.99866 3.55859C7.14077 3.55859 6.44531 4.25402 6.44531 5.1119C6.44531 5.96978 7.14077 6.66524 7.99866 6.66524Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.6654 10.4389C10.6654 9.23892 9.47203 8.26562 7.9987 8.26562C6.52536 8.26562 5.33203 9.23892 5.33203 10.4389"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default EmployeeTagIcon;
