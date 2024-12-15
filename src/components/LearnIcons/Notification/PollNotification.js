import PropTypes from 'prop-types';

export const PollNotificationSVG = () => (
  <svg
    height={50}
    width={50}
    viewBox="0 0 54 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="27"
      cy="27"
      r="25"
      fill="#E02C42"
      stroke="white"
      strokeWidth="2.4"
    />
    <g clipPath="url(#clip0_2682_4040)">
      <mask
        id="mask0_2682_4040"
        style={{ maskType: 'luminance' }}
        maskUnits="userSpaceOnUse"
        x="16"
        y="16"
        width="22"
        height="22"
      >
        <path d="M16 16V38H38V16H16Z" fill="white" />
      </mask>
      <g mask="url(#mask0_2682_4040)">
        <path
          d="M22.875 16L29.75 16V24.25H35.25V36.625H36.625V38H16L16 36.625H17.375L17.375 21.5H22.875V16ZM18.75 36.625H22.875V22.875H18.75V36.625ZM33.875 25.625H29.75V36.625H33.875V25.625ZM28.375 17.375H24.25V36.625H28.375V17.375Z"
          fill="white"
        />
      </g>
    </g>
    <defs>
      <clipPath id="clip0_2682_4040">
        <rect
          width="22"
          height="22"
          fill="white"
          transform="translate(16 16)"
        />
      </clipPath>
    </defs>
  </svg>
);

PollNotificationSVG.defaultProps = {
  width: 54,
  height: 54,
};

PollNotificationSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};
