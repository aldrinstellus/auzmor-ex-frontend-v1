import PropTypes from 'prop-types';
import React from 'react';

export const CourseDraftSVG = props => (
  <svg width={props.width} height={props.height} viewBox="0 0 14 14" {...props}>
    <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
      <g transform="translate(-347.000000, -7672.000000)">
        <g transform="translate(342.000000, 7667.000000)">
          <polygon points="0 0 24 0 24 24 0 24" />
          <path d="M14.7499768,13.9999785 L18.9999666,13.9999785 L18.9999666,5.74999821 C18.9999666,5.33438031 18.6655863,5 18.2499684,5 L5.74999821,5 C5.33438031,5 5,5.33438031 5,5.74999821 L5,18.2499684 C5,18.6655863 5.33438031,18.9999666 5.74999821,18.9999666 L13.9999785,18.9999666 L13.9999785,14.7499768 C13.9999785,14.3374716 14.3374716,13.9999785 14.7499768,13.9999785 Z M18.7812171,15.7187244 L15.7187244,18.7812171 C15.5780998,18.9218418 15.3874874,18.9999762 15.1874757,18.9999762 L14.9999762,18.9999762 L14.9999762,14.9999762 L18.9999762,14.9999762 L18.9999762,15.1905885 C18.9999762,15.3874874 18.9218418,15.5780998 18.7812171,15.7187244 Z" fill={props.color} fillRule="nonzero" />
        </g>
      </g>
    </g>
  </svg>
);

CourseDraftSVG.defaultProps = {
  width: 14,
  height: 14,
  color: '#101010',
};

CourseDraftSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
