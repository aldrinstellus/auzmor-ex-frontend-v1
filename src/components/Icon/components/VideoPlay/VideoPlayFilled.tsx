import { SVGProps } from 'react';

const SvgVideoFilled = (
  props: SVGProps<SVGSVGElement> & { ariaLabel?: string },
) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      fill="none"
      viewBox="0 0 18 18"
      {...props}
      aria-label={props.ariaLabel}
    >
      <path d="M11.047 1.5H6.953v3.27h4.094V1.5z" fill="currentColor"></path>
      <path
        fill="currentColor"
        d="M12.172 1.5v3.27h4.23c-.382-2.062-1.905-3.262-4.23-3.27z"
      ></path>
      <path
        fill="currentColor"
        d="M1.5 5.895v6.247c0 2.73 1.627 4.358 4.357 4.358h6.285c2.73 0 4.358-1.628 4.358-4.358V5.895h-15zm9.33 6.24l-1.56.9c-.33.187-.652.284-.952.284a1.23 1.23 0 01-.615-.157c-.436-.248-.676-.758-.676-1.418v-1.8c0-.66.24-1.17.675-1.417.435-.255.99-.21 1.568.128l1.56.9c.578.33.893.795.893 1.297 0 .502-.323.945-.893 1.282z"
      ></path>
      <path
        fill="currentColor"
        d="M5.828 1.5c-2.325.008-3.848 1.208-4.23 3.27h4.23V1.5z"
      ></path>
    </svg>
  );
};

export default SvgVideoFilled;
