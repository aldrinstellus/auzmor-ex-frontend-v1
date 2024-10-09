import React from 'react';
import PropTypes from 'prop-types';

export const UploaderSVG = props => (
  <React.Fragment>
    <svg version="1.0" width={props.width} height={props.height} viewBox="0 0 150.000000 120.000000" preserveAspectRatio="xMidYMid meet">
      <g transform="translate(0.000000,106.000000) scale(0.100000,-0.100000)" fill={props.color} stroke="none">
        <path d="M535 1047 c-132 -35 -240 -132 -286 -257 -19 -53 -27 -63 -74 -89
-60 -34 -114 -95 -147 -167 -19 -41 -23 -66 -23 -154 0 -92 3 -112 26 -160 36
-76 106 -145 187 -183 l67 -32 480 0 480 0 67 33 c73 36 124 87 160 161 19 39
23 62 23 146 0 89 -3 106 -27 150 -32 61 -97 127 -148 150 -32 15 -40 24 -49
62 -31 121 -139 203 -270 203 -38 0 -50 6 -97 49 -33 30 -77 58 -112 71 -70
27 -188 34 -257 17z m220 -136 c55 -25 101 -65 131 -116 l25 -43 46 20 c57 25
101 18 148 -23 44 -39 62 -94 46 -140 -16 -46 -16 -46 41 -52 184 -22 253
-252 111 -376 -68 -61 -89 -63 -568 -59 -464 3 -453 2 -530 69 -82 73 -108
195 -61 295 28 61 96 121 153 137 39 10 42 14 48 51 32 199 234 315 410 237z"
        />
        <path d="M536 621 c-106 -107 -127 -132 -121 -150 6 -19 13 -21 96 -21 l89 0
0 -110 0 -110 75 0 75 0 0 110 0 110 89 0 c83 0 90 2 96 21 6 18 -15 43 -121
150 -71 71 -133 129 -139 129 -6 0 -68 -58 -139 -129z"
        />
      </g>
    </svg>
  </React.Fragment>
);

UploaderSVG.defaultProps = {
  width: '150pt',
  height: '106pt',
  color: '#F36',
};

UploaderSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
