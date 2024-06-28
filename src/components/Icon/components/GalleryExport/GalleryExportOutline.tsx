import { SVGProps } from 'react';

const GalleryExportOutline = (
  props: SVGProps<SVGSVGElement> & { ariaLabel?: string },
) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 17 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    aria-label={props.ariaLabel}
  >
    <path
      d="M6.49935 6.66667C7.23573 6.66667 7.83268 6.06971 7.83268 5.33333C7.83268 4.59695 7.23573 4 6.49935 4C5.76297 4 5.16602 4.59695 5.16602 5.33333C5.16602 6.06971 5.76297 6.66667 6.49935 6.66667Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.16732 1.33398H6.50065C3.16732 1.33398 1.83398 2.66732 1.83398 6.00065V10.0007C1.83398 13.334 3.16732 14.6673 6.50065 14.6673H10.5007C13.834 14.6673 15.1673 13.334 15.1673 10.0007V6.66732"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.5 5.33398V1.33398L13.8333 2.66732"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.4993 1.33398L11.166 2.66732"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.2793 12.633L5.56596 10.4264C6.09263 10.073 6.85263 10.113 7.32596 10.5197L7.54596 10.713C8.06596 11.1597 8.90596 11.1597 9.42596 10.713L12.1993 8.33305C12.7193 7.88638 13.5593 7.88638 14.0793 8.33305L15.166 9.26638"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default GalleryExportOutline;
