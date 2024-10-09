import React from 'react';
import PropTypes from 'prop-types';

export const EditPencilSVG = props => (
  <React.Fragment>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width}
      height={props.height}
      viewBox="0 0 19 19"
    >
      <g
        fill="none"
        fillRule="evenodd"
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
      >
        <g stroke={props.color} strokeWidth="1.4" transform="translate(-328 -326)">
          <g transform="translate(79 131)">
            <g transform="translate(250 196)">
              <g>
                <path d="M16.305 4.347a.554.554 0 000-.778L13.518.783a.55.55 0 00-.779 0L2.357 11.165C2.23 11.293.42 15.853.351 16.02a.55.55 0 00.716.716c.16-.065 4.734-1.884 4.855-2.008L16.305 4.347h0z" />
                <path d="M2.357 11.165L5.922 14.729" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  </React.Fragment>
);

EditPencilSVG.defaultProps = {
  width: 9,
  height: 16,
  color: '#F36',
};

EditPencilSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
