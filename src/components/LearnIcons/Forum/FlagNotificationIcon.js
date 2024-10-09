import React from 'react';
import PropTypes from 'prop-types';

export const FlagNotificationIconSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="24" fill="#FF0000" />
      <path d="M26.1176 15.9706C25.79 15.9706 25.4758 15.8404 25.2441 15.6088C25.0125 15.3771 24.8824 15.0629 24.8824 14.7353C24.8824 14.4077 24.7522 14.0935 24.5205 13.8618C24.2889 13.6302 23.9747 13.5 23.6471 13.5H15V33.8824C15 34.0462 15.0651 34.2033 15.1809 34.3191C15.2967 34.4349 15.4538 34.5 15.6176 34.5C15.7815 34.5 15.9385 34.4349 16.0544 34.3191C16.1702 34.2033 16.2353 34.0462 16.2353 33.8824V23.3824H23.6471C23.9747 23.3824 24.2889 23.5125 24.5205 23.7442C24.7522 23.9758 24.8824 24.29 24.8824 24.6176C24.8824 24.9453 25.0125 25.2595 25.2441 25.4911C25.4758 25.7228 25.79 25.8529 26.1176 25.8529H34.7647V15.9706H26.1176Z" fill="white" />
    </svg>


  </React.Fragment>
);

FlagNotificationIconSVG.defaultProps = {
  width: 48,
  height: 48,
};

FlagNotificationIconSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};
