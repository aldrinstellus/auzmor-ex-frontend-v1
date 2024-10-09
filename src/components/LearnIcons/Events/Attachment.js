import React from 'react';
import PropTypes from 'prop-types';

export const AttachmentSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill="none" fillRule="evenodd">
        <path d="M-5-4h24v24H-5z" />
        <path
          d="M8.419 15.553l6.504-6.508a.398.398 0 000-.563l-.564-.563a.398.398 0 00-.563 0C12 9.714 9.086 12.63 7.292 14.427a3.335 3.335 0 01-4.72 0 3.334 3.334 0 010-4.716l7.47-7.472a2.207 2.207 0 113.123 3.123l-6.29 6.291a1.082 1.082 0 01-1.53-1.529l5.328-5.328a.398.398 0 000-.564l-.563-.563a.398.398 0 00-.564 0L4.218 8.997a2.674 2.674 0 103.783 3.783l6.29-6.291a3.8 3.8 0 000-5.377 3.806 3.806 0 00-5.375 0L1.445 8.584a4.927 4.927 0 000 6.97 4.927 4.927 0 006.974 0z"
          fill={props.color}
          fillRule="nonzero"
        />
      </g>
    </svg>
  </React.Fragment>
);

AttachmentSVG.defaultProps = {
  width: 18,
  height: 17,
  color: '#F36',
};

AttachmentSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
