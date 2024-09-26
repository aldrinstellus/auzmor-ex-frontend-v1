import { SVGProps } from 'react';

const SvgDocumentViewOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <g fill="currentColor">
      <path d="M13.75 16.25a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z"></path>
      <path d="M18.61 14.674a5.4 5.4 0 00-4.86-3.424 5.4 5.4 0 00-4.86 3.424L8.75 15l.14.326a5.4 5.4 0 004.86 3.424 5.4 5.4 0 004.86-3.424l.14-.326-.14-.326zM13.75 17.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"></path>
      <path d="M7.5 17.5H5v-15h5v3.75a1.254 1.254 0 001.25 1.25H15V10h1.25V6.25a.568.568 0 00-.188-.437l-4.375-4.375a.567.567 0 00-.437-.188H5A1.254 1.254 0 003.75 2.5v15A1.254 1.254 0 005 18.75h2.5V17.5zm3.75-14.75l3.5 3.5h-3.5v-3.5z"></path>
    </g>
  </svg>
);

export default SvgDocumentViewOutline;
