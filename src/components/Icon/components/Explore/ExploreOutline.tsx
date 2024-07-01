import { SVGProps } from 'react';

const SvgExploreOutline = (
  props: SVGProps<SVGSVGElement> & { ariaLabel?: string },
) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    aria-label={props.ariaLabel}
  >
    <path
      d="M18.816 13.58C21.108 15.718 22.362 17.58 21.908 18.48C21.163 19.94 16.125 18.221 10.653 14.642C5.183 11.063 1.349 6.978 2.093 5.519C2.557 4.609 5.019 5.075 7.896 6.324M19 12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12C5 8.13401 8.13401 5 12 5C15.866 5 19 8.13401 19 12Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgExploreOutline;
