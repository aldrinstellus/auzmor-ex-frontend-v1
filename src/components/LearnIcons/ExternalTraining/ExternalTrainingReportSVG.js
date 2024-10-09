import React from 'react';
import PropTypes from 'prop-types';

export const ExternalTrainingReportSVG = props => (
  <svg width={props.width} height={props.height} viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M9.99373 2.85996L7.66934 0.745605V2.85996H9.99373ZM6.5695 13.0192V11.809V11.7794H1.59415V11.0143H8.29733V10.0822H1.59415V9.3171H8.2971V9.31637H9.06219H9.99351V3.43381H7.09527V0.745605H1.42467C0.682296 0.745605 0.0805664 1.34734 0.0805664 2.08971V12.0029C0.0805664 12.7453 0.682149 13.3471 1.42467 13.3471H6.5695V13.0192ZM10.2724 13.0193H12V11.8091H10.2724V10.0815H9.06241V11.8091H7.33459V13.0193H9.06241V14.7469H10.2724V13.0193ZM8.48026 4.22529H1.59425V4.99037H8.48026V4.22529ZM1.59425 7.61966H8.48026V8.38475H1.59425V7.61966ZM8.48026 5.92247H1.59425V6.68756H8.48026V5.92247Z" fill={props.color} />
  </svg>

);

ExternalTrainingReportSVG.defaultProps = {
  width: 12,
  height: 15,
  color: '#FF3366',
};

ExternalTrainingReportSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
