import React from 'react';
import PropTypes from 'prop-types';

export const ExportSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M7.01244 4.63721L4.30606 4.63721L1.08936 8.45135" stroke={props.color} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.1503 8.45135L14.9336 4.63721L12.2202 4.63721" stroke={props.color} strokeLinecap="round" strokeLinejoin="round" />
      <path fillRule="evenodd" clipRule="evenodd" d="M12.9478 8.45166V10.1854C12.9478 10.8876 12.3897 11.4568 11.7012 11.4568H7.5767C6.88827 11.4568 6.33025 10.8875 6.33025 10.1854V8.45166H1.08936V14.5816C1.08936 15.3548 1.70961 15.9875 2.46769 15.9875H16.7721C17.5302 15.9875 18.1505 15.3548 18.1505 14.5816V8.45166H12.9478V8.45166Z" stroke={props.color} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.61638 8.45174V1.12207" stroke={props.color} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.9525 6.06885L9.61637 8.45166L7.28027 6.06885" stroke={props.color} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </React.Fragment>
);

ExportSVG.defaultProps = {
  width: 19,
  height: 17,
  color: 'white',
};

ExportSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
