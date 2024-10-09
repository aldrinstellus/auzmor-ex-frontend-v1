import React from 'react';
import PropTypes from 'prop-types';

export const TrashLightSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <path
          d="M16.196 21a1.71 1.71 0 001.684-1.582L18.625 7.5h.562c.311 0 .563-.252.563-.563v-.562a.563.563 0 00-.563-.563h-2.896L15.095 3.82c-.271-.452-.92-.819-1.447-.819h-3.546c-.528 0-1.176.367-1.447.82L7.459 5.811H4.562A.563.563 0 004 6.375v.562c0 .311.252.563.562.563h.563l.745 11.918A1.71 1.71 0 007.554 21h8.642zM14.322 5.812H9.428l.675-1.125h3.544l.675 1.125zm1.874 13.5H7.555L6.816 7.5h10.118l-.738 11.812z"
          id="trashLight_svg__a"
        />
      </defs>
      <g fill="none" fillRule="evenodd">
        <path d="M-4-3h24v24H-4z" />
        <g fillRule="nonzero" transform="translate(-4 -3)">
          <use fill="#000" xlinkHref="#trashLight_svg__a" />
          <use fill={props.color} xlinkHref="#trashLight_svg__a" />
        </g>
      </g>
    </svg>
  </React.Fragment>
);

TrashLightSVG.defaultProps = {
  width: 19,
  height: 16,
  color: 'primary.main',
};

TrashLightSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
