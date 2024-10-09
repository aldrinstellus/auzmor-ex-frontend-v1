import PropTypes from 'prop-types';
import React from 'react';

export const SearchSVG = props => (
  <React.Fragment>
    <svg height={props.height} width={props.width} viewBox="0 0 23 24" {...props}>
      <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd" strokeLinecap="round">
        <g transform="translate(-93.000000, -296.000000)" fillRule="nonzero" stroke={props.color} strokeWidth={2}>
          <g transform="translate(94.000000, 297.000000)">
            <circle cx="8.55555556" cy="8.55555556" r="8.55555556" />
            <path d="M14.5918516,15.4066664 L20.3773925,21.1922074" />
          </g>
        </g>
      </g>
    </svg>
  </React.Fragment>
);

SearchSVG.defaultProps = {
  width: 23,
  height: 24,
  color: '#000',
};

SearchSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
