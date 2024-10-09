import React from 'react';
import PropTypes from 'prop-types';

export const WarningSVG = props => (
  <React.Fragment>
    <svg height={props.height} width={props.width} viewBox="0 0 20 17" fill="none" {...props}>
      <path
        d="M5.328 4.78l.15 2.406c0 .15.108.236.258.236h.881c.13 0 .258-.108.258-.236l.15-2.407c0-.15-.107-.279-.257-.279H5.586c-.15 0-.258.129-.258.28zM7.09 8.624a.908.908 0 00-.902-.902.894.894 0 00-.903.902c0 .516.387.902.902.902a.894.894 0 00.903-.902zM7.068.891C6.682.225 5.672.203 5.285.89L.13 9.85c-.387.666.107 1.525.902 1.525h10.291c.795 0 1.29-.838.903-1.525L7.068.89zm-5.93 9.28l4.92-8.55c.065-.086.172-.086.237 0l4.92 8.55c.064.087 0 .173-.108.173h-9.86c-.108 0-.173-.086-.108-.172z"
        fill={props.color}
      />
    </svg>
  </React.Fragment>
);

WarningSVG.defaultProps = {
  width: 13,
  height: 12,
  color: '#959595',
};

WarningSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
