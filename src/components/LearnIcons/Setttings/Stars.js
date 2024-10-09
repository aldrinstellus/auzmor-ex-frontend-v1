import React from 'react';
import PropTypes from 'prop-types';

export const StarsSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M13.125 6.75l1.043-2.082 2.082-1.043-2.082-1.043L13.125.5l-1.043 2.082L10 3.625l2.082 1.043 1.043 2.082zM11.578 20.5a.9.9 0 00.887-1.05l-.7-4.087 2.965-2.89a.9.9 0 00-.5-1.532l-4.093-.597-1.832-3.719a.89.89 0 00-.809-.5.876.876 0 00-.8.5l-1.833 3.719-4.093.597a.897.897 0 00-.497 1.532l2.965 2.89-.703 4.086a.898.898 0 00.883 1.051.873.873 0 00.418-.105l3.664-1.93 3.664 1.93c.137.07.277.105.414.105zm6.547-10l.625-1.25L20 8.625 18.75 8l-.625-1.25L17.5 8l-1.25.625 1.25.625.625 1.25zm-7.844 7.313l-1.91-1.004-.871-.461-.875.46-1.91 1.005.367-2.13.168-.972-.707-.688-1.55-1.511 2.14-.313.976-.14.438-.883.953-1.938.953 1.938.438.883.976.14 2.14.313-1.554 1.511-.707.688.168.973.367 2.129z"
        fill={props.color}
        fillRule="nonzero"
      />
    </svg>
  </React.Fragment>
);

StarsSVG.defaultProps = {
  width: 26,
  height: 20,
  color: '#FF3366',
};

StarsSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
