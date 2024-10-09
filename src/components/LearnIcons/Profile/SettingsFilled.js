import React from 'react';
import PropTypes from 'prop-types';

export const SettingsFilledSVG = props => (
  <svg width={props.width} height={props.height} viewBox="0 0 133.000000 137.000000" preserveAspectRatio="xMidYMid meet" {...props}>
    <g
      transform="translate(0.000000,137.000000) scale(0.100000,-0.100000)"
      fill={props.color}
      stroke="none"
    >
      <path d="M570 1320 c-68 -10 -80 -26 -80 -107 l0 -63 -37 -17 c-21 -10 -57
-30 -80 -45 l-42 -28 -66 36 -66 36 -40 -43 c-44 -48 -119 -188 -119 -223 0
-16 15 -31 60 -57 l60 -34 0 -97 0 -97 -60 -36 c-40 -25 -60 -43 -60 -56 0
-59 126 -259 163 -259 11 0 43 14 71 31 50 32 51 32 81 14 16 -10 54 -31 83
-47 l52 -30 0 -62 c0 -100 2 -101 170 -101 168 0 170 1 170 101 l0 62 53 30
c28 16 66 37 82 47 30 18 31 18 81 -14 28 -17 60 -31 71 -31 37 0 163 200 163
259 0 13 -20 31 -60 56 l-60 36 0 97 0 97 60 34 c45 26 60 41 60 57 0 35 -75
175 -119 223 l-40 43 -66 -36 -66 -36 -42 28 c-23 15 -59 35 -79 45 l-38 17 0
63 c0 83 -11 96 -90 107 -73 11 -93 11 -170 0z m168 -446 c79 -33 132 -110
132 -194 0 -125 -88 -214 -210 -214 -122 0 -210 89 -210 214 0 147 154 250
288 194z"
      />
    </g>
  </svg>
);

SettingsFilledSVG.defaultProps = {
  width: '133.000000pt',
  height: '137.000000pt',
  color: '#000000',
};

SettingsFilledSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
