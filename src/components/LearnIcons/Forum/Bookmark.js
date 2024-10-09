import React from 'react';
import PropTypes from 'prop-types';

export const BookmarkSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.4444 15L7.22222 10.3333L1 15V2.55556C1 2.143 1.16389 1.74733 1.45561 1.45561C1.74733 1.16389 2.143 1 2.55556 1H11.8889C12.3014 1 12.6971 1.16389 12.9888 1.45561C13.2806 1.74733 13.4444 2.143 13.4444 2.55556V15Z" stroke={props.color} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </React.Fragment>
);

BookmarkSVG.defaultProps = {
  width: 14,
  height: 16,
  color: '#000',
};

BookmarkSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
