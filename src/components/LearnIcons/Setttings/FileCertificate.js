import React from 'react';
import PropTypes from 'prop-types';

export const FileCertificateSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M18.122 20.5c1.035 0 1.878-.84 1.878-1.875V5.655c0-.496-.202-.976-.554-1.328L16.17 1.051A1.875 1.875 0 0014.846.5H6.875A1.881 1.881 0 005 2.379V5.5h1.875V2.379h6.248V6.44c0 .52.418.937.938.937h4.064v11.248H8.75V20.5h9.372zM17.97 5.503h-2.972V2.53l2.972 2.972zM7.5 20.5v-4.468c.168-.079.059-.043.618-.195.395-.108.703-.422.809-.823.214-.81.157-.709.738-1.3.289-.294.402-.723.296-1.125-.212-.806-.213-.693 0-1.5a1.178 1.178 0 00-.296-1.125c-.58-.59-.525-.492-.737-1.3a1.153 1.153 0 00-.81-.823c-.791-.216-.696-.16-1.276-.75a1.13 1.13 0 00-1.105-.301c-.794.216-.682.216-1.475 0a1.13 1.13 0 00-1.105.301c-.582.593-.488.535-1.277.75a1.155 1.155 0 00-.809.823c-.213.81-.156.709-.737 1.3a1.178 1.178 0 00-.296 1.125c.213.809.212.695 0 1.5-.106.402.007.83.296 1.125.58.59.525.493.737 1.3.106.402.415.715.81.823.558.152.45.116.618.195V20.5L5 19.25l2.5 1.25zM5 14.25a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"
        fill={props.color}
        fillRule="nonzero"
      />
    </svg>
  </React.Fragment>
);

FileCertificateSVG.defaultProps = {
  width: 26,
  height: 20,
  color: '#FF3366',
};

FileCertificateSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
