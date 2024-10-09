import React from 'react';
import PropTypes from 'prop-types';

export const KeySVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M6.562 20.5c.518 0 .938-.42.938-.938v-.937h.937c.518 0 .938-.42.938-.937v-.782l1.564-1.569a7.5 7.5 0 10-5.87-6.31L.276 13.825a1.077 1.077 0 00-.275.663v5.075c0 .518.42.938.937.938h5.625zm-.937-1.875h-3.75v-3.75l5.241-5.241a6.745 6.745 0 01-.241-1.63V8a5.625 5.625 0 113.529 5.221L8.75 14.875H7.5v1.875H5.625v1.875zM14.375 8a1.875 1.875 0 100-3.75 1.875 1.875 0 000 3.75z"
        fill={props.color}
        fillRule="nonzero"
      />
    </svg>
  </React.Fragment>
);

KeySVG.defaultProps = {
  width: 26,
  height: 20,
  color: '#FF3366',
};

KeySVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
