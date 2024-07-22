import { SVGProps } from 'react';

const SvgExploreFilled = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path fill="currentColor" d="M12 19a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18.816 13.58c2.292 2.138 3.546 4 3.092 4.9-.745 1.46-5.783-.259-11.255-3.838-5.47-3.579-9.304-7.664-8.56-9.123.464-.91 2.926-.444 5.803.805M19 12a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
    />
    <path
      stroke="#fff"
      strokeLinecap="square"
      strokeLinejoin="round"
      d="M16.641 17.908c-1.776-.752-3.849-1.867-5.988-3.266-2.122-1.388-3.998-2.853-5.455-4.21-.117-.11-.23-.217-.341-.324"
    />
  </svg>
);

export default SvgExploreFilled;
