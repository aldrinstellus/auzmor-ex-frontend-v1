import React from 'react';
import PropTypes from 'prop-types';

export const BellSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill="none" fillRule="evenodd">
        <path d="M-4-4h24v24H-4z" />
        <path
          d="M16.246 16.75c.747 0 1.25-.61 1.254-1.25a1.22 1.22 0 00-.336-.848c-.755-.811-2.167-2.03-2.167-6.027 0-3.035-2.128-5.465-4.998-6.06V1.75a1.25 1.25 0 10-2.498 0v.814C4.63 3.16 2.503 5.59 2.503 8.625c0 3.996-1.412 5.216-2.167 6.027A1.22 1.22 0 000 15.5c.004.64.507 1.25 1.254 1.25h14.992zm-1.384-1.875H2.638c.829-1.093 1.735-2.904 1.74-6.227 0-.008-.003-.015-.003-.023a4.375 4.375 0 118.75 0l-.002.023c.004 3.324.91 5.135 1.74 6.227zM8.75 20.5a2.5 2.5 0 002.499-2.5H6.25a2.5 2.5 0 002.499 2.5z"
          fill={props.color}
          fillRule="nonzero"
          opacity={0.67}
        />
      </g>
    </svg>
  </React.Fragment>
);

BellSVG.defaultProps = {
  width: 26,
  height: 20,
  color: '#FF3366',
};

BellSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
