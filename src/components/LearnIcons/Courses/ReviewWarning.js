import React from 'react';
import PropTypes from 'prop-types';

export const ReviewWarningSVG = props => (
  <React.Fragment>
    <svg
      width={props.width}
      height={props.height}
      viewBox="0 0 10 39"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5 0.198242C2.49739 0.198242 0.46875 2.22687 0.46875 4.72947V33.909C0.46875 36.4116 2.49739 38.4402 5 38.4402C7.50261 38.4402 9.53125 36.4116 9.53125 33.909V4.72947C9.53125 2.22687 7.50261 0.198242 5 0.198242Z"
        fill={props.color}
      />
    </svg>
  </React.Fragment>
);

ReviewWarningSVG.defaultProps = {
  width: 10,
  height: 39,
  color: 'white',
};

ReviewWarningSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
