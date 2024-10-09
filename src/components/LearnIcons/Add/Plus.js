import React from 'react';
import PropTypes from 'prop-types';

export const AddPlusSVG = props => (
  <React.Fragment>
    <svg height={props.height} width={props.width} viewBox="0 0 17 17" fill="none" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M9.75 0H7.25V7.25H0V9.75H7.25V17H9.75V9.75H17V7.25H9.75V0Z" fill={props.color} />
    </svg>
  </React.Fragment>
);

AddPlusSVG.defaultProps = {
  width: 17,
  height: 17,
  color: 'black',
};

AddPlusSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
