import React from 'react';
import PropTypes from 'prop-types';

export function RetrySVG(props) {
  return (
    <svg width={props.width} height={props.height} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.2383 6.76177C11.2383 4.22283 9.42223 2.10176 7.0219 1.62506L8.26659 0.62939L7.76292 -1.51913e-07L5.74821 1.61177C5.65029 1.69034 5.59711 1.8072 5.59711 1.92647C5.59711 1.98731 5.61082 2.04895 5.63941 2.10659L6.84825 4.52423L7.56912 4.1636L6.68102 2.38704C8.80212 2.71664 10.4324 4.54962 10.4324 6.76177C10.4324 9.20562 8.4439 11.1941 6.00005 11.1941C3.55619 11.1941 1.56769 9.20562 1.56769 6.76177L0.761813 6.76177C0.761813 9.65004 3.11177 12 6.00005 12C8.88832 12 11.2383 9.65004 11.2383 6.76177Z" fill={props.color} />
    </svg>
  );
}

RetrySVG.defaultProps = {
  width: 12,
  height: 12,
};

RetrySVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string.isRequired,
};
