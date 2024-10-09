import React from 'react';
import PropTypes from 'prop-types';

export const SelectionOutlineSVG = props => (
  <React.Fragment>
    <svg height={props.height} width={props.width} viewBox="0 0 25 25" fill="none" {...props}>
      <path opacity="0.6" d="M24.5 12.5C24.5 19.1274 19.1274 24.5 12.5 24.5C5.87258 24.5 0.5 19.1274 0.5 12.5C0.5 5.87258 5.87258 0.5 12.5 0.5C19.1274 0.5 24.5 5.87258 24.5 12.5Z" stroke={props.color} />
    </svg>
  </React.Fragment>
);

SelectionOutlineSVG.defaultProps = {
  width: 25,
  height: 25,
  color: '#5C5C5C',
};

SelectionOutlineSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
