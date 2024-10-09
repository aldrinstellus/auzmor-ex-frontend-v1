import React from 'react';
import PropTypes from 'prop-types';

export const CsvFileSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} {...props}>
      <g fill="none" fillRule="evenodd">
        <g fill="#BEC0C3" fillRule="nonzero">
          <path d="M12.835 6.74V2.186C12.835-.04 10.98.5 9.75.5H0v25.34h19.5V9.508c0-1.23.5-2.768-1.37-2.768h-5.295z" />
          <path d="M18.288 5.642L14 1.5v4.142z" />
        </g>
        <text
          fontFamily="ProximaNova-Bold, Proxima Nova"
          fontSize={7}
          fontWeight="bold"
          letterSpacing={0.14}
          fill="#FFF"
        >
          <tspan x={1} y={18}>
            .CSV
          </tspan>
        </text>
      </g>
    </svg>
  </React.Fragment>
);

CsvFileSVG.defaultProps = {
  width: 18,
  height: 18,
};

CsvFileSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};
