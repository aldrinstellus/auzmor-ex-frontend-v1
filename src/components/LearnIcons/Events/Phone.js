import React from 'react';
import PropTypes from 'prop-types';

export const PhoneSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill="none" fillRule="evenodd">
        <path d="M-6-6h24v24H-6z" />
        <path
          d="M11.781 13C5.28 13 0 7.732 0 1.22 0 .935.196.689.472.625l2.64-.61a.613.613 0 01.7.353L5.03 3.212a.608.608 0 01-.175.711l-1.539 1.26a9.41 9.41 0 004.5 4.499l1.259-1.539a.609.609 0 01.71-.175l2.844 1.219c.272.119.422.413.356.7l-.61 2.641a.61.61 0 01-.594.472z"
          fill={props.stroke ? '#fff' : props.color}
          stroke={props.color}
          strokeWidth={props.stroke}
          fillRule="nonzero"
        />
      </g>
    </svg>
  </React.Fragment>
);

PhoneSVG.defaultProps = {
  width: 19,
  height: 16,
  stroke: 0,
  color: '#F36',
};

PhoneSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  stroke: PropTypes.number,
  color: PropTypes.string,
};
