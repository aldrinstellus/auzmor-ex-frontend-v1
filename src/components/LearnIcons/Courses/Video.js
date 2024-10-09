import React from 'react';
import PropTypes from 'prop-types';

export function VideoSVG(props) {
  return (
    <svg width={17} height={15} viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M1.31592 1.32568H15.8506V13.6756H1.31592V1.32568Z" stroke={props.color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path fillRule="evenodd" clipRule="evenodd" d="M7.54168 8.8C7.42885 8.80034 7.32036 8.71398 7.32036 8.59987L7.31946 4.56579C7.31824 4.2441 7.51392 4.17666 7.70693 4.32495L10.1461 6.28299C10.1515 6.28734 10.1566 6.29205 10.1615 6.29709C10.3043 6.44229 10.2875 6.64012 10.1665 6.7524C10.0569 6.83967 7.67961 8.7992 7.54168 8.8V8.8Z" stroke={props.color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.31592 11.7256H15.8506" stroke={props.color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

VideoSVG.defaultProps = {
  color: '#FF3366',
};

VideoSVG.propTypes = {
  color: PropTypes.string,
};
