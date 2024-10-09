import React from 'react';
import PropTypes from 'prop-types';

export const DescriptionSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill="none" fillRule="evenodd">
        <path d="M-6-6h24v24H-6z" />
        <path
          d="M6.987 1.625c.18 0 .325-.146.325-.326V.326a.326.326 0 00-.26-.32L6.988 0H.326a.326.326 0 00-.32.26L0 .326v.973c0 .18.146.326.326.326h6.661zm3.982 3.25a.406.406 0 00.406-.406v-.813a.406.406 0 00-.406-.406H.406A.406.406 0 000 3.656v.813c0 .224.182.406.406.406H10.97zm-3.982 3.25a.326.326 0 00.319-.26l.006-.066v-.974a.326.326 0 00-.26-.318L6.988 6.5H.326a.326.326 0 00-.32.26L0 6.826v.973c0 .18.146.326.326.326h6.661zm3.982 3.25a.406.406 0 00.406-.406v-.813a.406.406 0 00-.406-.406H.406a.406.406 0 00-.406.406v.813c0 .224.182.406.406.406H10.97z"
          fill={props.color}
          fillRule="nonzero"
        />
      </g>
    </svg>
  </React.Fragment>
);

DescriptionSVG.defaultProps = {
  width: 15,
  height: 16,
  color: '#5E6167',
};

DescriptionSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
