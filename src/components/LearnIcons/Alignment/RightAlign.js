import React from 'react';
import PropTypes from 'prop-types';

export const RightAlignSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 24 24" fill={props.color}><path d="M0 0h24v24H0V0z" fill="none" /><path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z" /></svg>
  </React.Fragment>
);

RightAlignSVG.defaultProps = {
  width: 24,
  height: 24,
  color: 'black',
};

RightAlignSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
