import React from 'react';
import PropTypes from 'prop-types';

export const FontCaseSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M1.296 15c.238 0 .5-.181.584-.404l1.566-3.971h6.858l1.567 3.97a.672.672 0 00.584.405h.671a.625.625 0 00.585-.846L8.3.404A.672.672 0 007.716 0H6.033c-.239 0-.5.181-.585.404L.039 14.154A.625.625 0 00.624 15h.672zm8.268-6.25H4.186l2.689-6.813L9.564 8.75zM24.374 15c.346 0 .626-.28.626-.625v-10a.625.625 0 00-.625-.625h-.625a.625.625 0 00-.625.625v.5C22.265 4.183 21.189 3.75 20 3.75c-2.76 0-5 2.24-5 5V10c0 2.76 2.24 5 5 5 1.189 0 2.266-.432 3.125-1.126v.501c0 .345.28.625.625.625h.625zM20 13.125A3.126 3.126 0 0116.875 10V8.75a3.126 3.126 0 016.25 0V10c0 1.725-1.4 3.125-3.125 3.125z"
        fill={props.color}
        fillRule="nonzero"
      />
    </svg>
  </React.Fragment>
);

FontCaseSVG.defaultProps = {
  width: 26,
  height: 20,
  color: '#FF3366',
};

FontCaseSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
