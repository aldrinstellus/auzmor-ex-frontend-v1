import React from 'react';
import PropTypes from 'prop-types';

export const CredentialSVG = props => (
  <svg width={props.width} height={props.height} viewBox="0 0 32 32" fill="none" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M16 23.9146V26.509C16 26.7802 16.2319 27 16.5 27C16.7761 27 17 26.7721 17 26.509V23.9146C17.5826 23.7087 18 23.1531 18 22.5C18 21.6716 17.3284 21 16.5 21C15.6716 21 15 21.6716 15 22.5C15 23.1531 15.4174 23.7087 16 23.9146ZM24 9.5V8.49924C24 4.35752 20.6337 1 16.5 1C12.3579 1 9 4.35671 9 8.49924V16C7.34233 16.0047 6 17.3396 6 19.0095V28.9905C6 30.6526 7.34559 32 9.00879 32H23.9912C25.6529 32 27 30.6634 27 28.9905V19.0095C27 17.3503 25.6591 16.0047 24 16H22.4819H12.0275C12.0093 15.836 12 15.6694 12 15.5005V8.49947C12 6.01021 14.0147 4 16.5 4C18.9802 4 21 6.01448 21 8.49947V9.5V12.124C21 13.1601 21.6658 14 22.5 14C23.3284 14 24 13.1518 24 12.124V9.5Z" fill={props.color} fillOpacity="0.89" />
  </svg>
);

CredentialSVG.defaultProps = {
  width: 32,
  height: 32,
  color: '#FF3366',
};

CredentialSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
