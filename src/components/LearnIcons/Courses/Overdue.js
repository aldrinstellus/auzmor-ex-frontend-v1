import React from 'react';
import PropTypes from 'prop-types';

export const CourseOverDueSVG = props => (
  <svg width={props.width} height={props.height} viewBox="0 0 55 52" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M5.64844 50.5227V42.9807H46.6417V50.5227" stroke="#231F20" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <path fillRule="evenodd" clipRule="evenodd" d="M34.1855 24.4533V42.1123H18.1055V24.4533C18.1055 19.9886 21.7039 16.3726 26.1434 16.3726C30.5868 16.3726 34.1855 19.9886 34.1855 24.4533Z" fill="#F83951" />
    <path d="M14.4746 42.9807V22.9346C14.4746 16.4541 19.6979 11.2061 26.1413 11.2061C32.5904 11.2061 37.8134 16.4541 37.8134 22.9346V42.9807" stroke="#231F20" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.3359 50.5228H53.3768" stroke="#231F20" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.16016 50.5228H12.4281" stroke="#231F20" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M26.1458 6.73796V1.1604" stroke="#231F20" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M42.7676 19.9676L48.1925 18.7253" stroke="#231F20" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M36.8379 9.7564L40.6937 5.7439" stroke="#231F20" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5382 19.9676L5.11328 18.7253" stroke="#231F20" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16.4671 9.7564L12.6113 5.7439" stroke="#231F20" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20.3613 25.3355C20.3613 25.3355 20.428 19.4762 25.1795 19.3464" stroke="#231F20" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>

);

CourseOverDueSVG.defaultProps = {
  width: 55,
  height: 52,
};

CourseOverDueSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};
