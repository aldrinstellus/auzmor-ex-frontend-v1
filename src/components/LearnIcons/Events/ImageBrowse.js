import React from 'react';
import PropTypes from 'prop-types';

export const ImageBrowseSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill="none" fillRule="evenodd">
        <path d="M-5-6h24v24H-5z" />
        <path
          d="M13.594 11.25c.776 0 1.406-.63 1.406-1.406V1.406C15 .63 14.37 0 13.594 0H1.406C.63 0 0 .63 0 1.406v8.438c0 .776.63 1.406 1.406 1.406h12.188zm0-.938H1.406a.47.47 0 01-.469-.468V1.406a.47.47 0 01.47-.469h12.187a.47.47 0 01.468.47v8.437a.47.47 0 01-.468.468zM3.28 4.922a1.64 1.64 0 100-3.281 1.64 1.64 0 000 3.28zm0-.938a.704.704 0 11.002-1.407.704.704 0 01-.002 1.407zm9.492 5.391a.352.352 0 00.352-.352V6.328a.703.703 0 00-.206-.497l-2.578-2.578a.703.703 0 00-.994 0L6.562 6.037l-.909-.91a.703.703 0 00-.994 0L2.081 7.707a.807.807 0 00-.206.497v.82c0 .195.157.352.352.352h10.546zm-.586-.938H2.812V8.3l2.344-2.344 1.406 1.407L9.844 4.08l2.343 2.344v2.012z"
          fill={props.color}
          fillRule="nonzero"
        />
      </g>
    </svg>
  </React.Fragment>
);

ImageBrowseSVG.defaultProps = {
  width: 15,
  height: 16,
  color: '#4C4C4C',
};

ImageBrowseSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
