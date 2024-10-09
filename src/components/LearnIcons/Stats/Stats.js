import React from 'react';
import PropTypes from 'prop-types';

export const StatsSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M15.5 22.4348H5.41309" stroke={props.color} strokeWidth="1.5" />
      <path d="M15.5 18.6522H5.41309" stroke={props.color} strokeWidth="1.5" />
      <path d="M15.5 14.8695H5.41309" stroke={props.color} strokeWidth="1.5" />
      <path d="M9.19569 11.0869H5.41309" stroke={props.color} strokeWidth="1.5" />
      <path d="M23.6953 22.4348C23.6953 22.5421 26.2235 29.5101 26.2235 29.5101C26.4209 30.1297 27.2124 30.1846 27.4298 29.5103C27.4298 29.5103 29.9997 22.5424 29.9997 22.4347" stroke={props.color} strokeWidth="1.5" />
      <path d="M25.5723 27.6375H28.0323" stroke={props.color} strokeWidth="1.5" />
      <path fillRule="evenodd" clipRule="evenodd" d="M18.9035 30H2.11549C1.57004 30 1 29.5514 1 28.9991V2.00088C1 1.44862 1.57004 1 2.11549 1H14.9529L19.913 6.00111V28.9991C19.913 29.5514 19.4488 30 18.9035 30V30Z" stroke={props.color} strokeWidth="1.5" />
      <path d="M14.9531 1.00098V6.00108H19.8912" stroke={props.color} strokeWidth="1.5" />
      <path fillRule="evenodd" clipRule="evenodd" d="M27.604 1H26.1852C24.7925 1 23.6953 2.12999 23.6953 3.52275V22.4348H29.9997V3.52275C29.9997 2.12999 28.9968 1 27.604 1V1Z" stroke={props.color} strokeWidth="1.5" />
    </svg>
  </React.Fragment>
);

StatsSVG.defaultProps = {
  width: 20,
  height: 21,
  color: '#FF3366',
};

StatsSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
