import React from 'react';
import PropTypes from 'prop-types';

export const WhiteCircleSVG = props => (
  <React.Fragment>
    <svg
      width={props.width}
      height={props.height}
      viewBox="0 0 14 14"
      {...props}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 13.2197C10.3784 13.2197 13.1172 10.481 13.1172 7.10255C13.1172 3.72411 10.3784 0.985352 7 0.985352C3.62157 0.985352 0.882812 3.72411 0.882812 7.10255C0.882812 10.481 3.62157 13.2197 7 13.2197Z"
        fill={props.color}
      />
    </svg>
  </React.Fragment>
);

WhiteCircleSVG.defaultProps = {
  width: 14,
  height: 14,
  color: 'white',
};

WhiteCircleSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
