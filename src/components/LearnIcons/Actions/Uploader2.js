import PropTypes from 'prop-types';
import React from 'react';

export const Uploader2SVG = props => (
  <React.Fragment>
    <svg
      width={props.width}
      height={props.height}
      viewBox="0 0 45 44"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <path
        d="M7.83379 27.3158C6.4717 25.9242 5.44417 24.2408 4.82902 22.3932C4.21388 20.5456 4.02725 18.5823 4.28329 16.6519C4.53932 14.7215 5.2313 12.8746 6.3068 11.2513C7.3823 9.62793 8.81313 8.27062 10.4909 7.28215C12.1687 6.29368 14.0494 5.69999 15.9906 5.54603C17.9318 5.39208 19.8826 5.6819 21.6952 6.39355C23.5078 7.1052 25.1347 8.22001 26.4526 9.65354C27.7706 11.0871 28.745 12.8017 29.3021 14.6676H32.5838C34.3539 14.6674 36.0771 15.2366 37.4989 16.2909C38.9208 17.3453 39.9657 18.8291 40.4795 20.5229C40.9933 22.2168 40.9487 24.0311 40.3522 25.6977C39.7557 27.3642 38.6391 28.7948 37.1671 29.778"
        stroke={props.color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.5 22V38.5"
        stroke={props.color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M29.8346 29.3333L22.5013 22L15.168 29.3333"
        stroke={props.color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </React.Fragment>
);

Uploader2SVG.defaultProps = {
  width: 45,
  height: 44,
  color: '#525252',
};

Uploader2SVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
