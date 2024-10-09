import React from 'react';
import PropTypes from 'prop-types';

export const CourseProgressSVG = props => (
  <svg width={props.width} height={props.height} viewBox="0 0 48 47" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M30.498 24.6292C36.6106 27.236 41.8404 34.3506 40.7189 45.1239H35.0344" stroke="#231F20" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14.1855 45.1237H8.28143C7.15991 34.3503 12.3897 27.2358 18.5022 24.6289" stroke="#231F20" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <path fillRule="evenodd" clipRule="evenodd" d="M16.4731 45.8702C15.7339 38.77 20.3523 34.7561 24.4243 34.7446H25.2251C29.2971 34.7561 33.9154 38.77 33.1763 45.8702H16.4731Z" fill="#1476CC" />
    <path d="M39.9751 11.0745C40.7739 8.36537 41.0855 5.2363 40.7188 1.71655H8.28142C7.8039 6.30369 8.4779 10.2279 9.88102 13.4229" stroke="#231F20" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <path fillRule="evenodd" clipRule="evenodd" d="M39.2221 14.7396C39.2221 14.7396 36.9842 20.1895 28.1639 19.6868C23.5405 19.4234 19.7109 12.9666 19.7109 12.9666C19.7109 12.9666 40.2622 7.70015 39.2221 14.7396Z" fill="#00315D" />
    <path fillRule="evenodd" clipRule="evenodd" d="M39.2206 14.7397C36.1853 20.8588 30.4946 24.1668 25.2534 24.1814H23.6406C18.9715 24.1685 13.9453 21.5413 10.7578 16.6414C10.7578 16.6414 13.9427 11.9141 18.1541 11.9219C22.3655 11.9296 27.6878 17.4268 32.4298 17.2044C38.925 16.8997 39.2206 14.7397 39.2206 14.7397Z" fill="#1476CC" />
    <path fillRule="evenodd" clipRule="evenodd" d="M24.2383 37.2284H25.4101V22.2881H24.2383V37.2284Z" fill="#1476CC" />
    <path d="M1.71484 1.71655H46.3874" stroke="#231F20" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M37.7305 45.1238H46.8372" stroke="#231F20" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.16406 45.1238H11.8354" stroke="#231F20" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);


CourseProgressSVG.defaultProps = {
  width: 48,
  height: 27,
};

CourseProgressSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};
