import React from 'react';
import PropTypes from 'prop-types';

export const WorkflowSVG = props => (
  <React.Fragment>
    <svg
      width={props.width}
      height={props.height}
      viewBox="0 0 19 19"
      fill="none"
      {...props}
    >
      <path
        d="M16.0167 12.963V9.18518H9.78333V6.03704H11.7667V1H7.23333V6.03704H9.21667V9.18518H2.98333V12.963H1V18H5.53333V12.963H3.55V9.81481H9.21667V12.963H7.23333V18H11.7667V12.963H9.78333V9.81481H15.45V12.963H13.4667V18H18V12.963H16.0167ZM7.8 1.62963H11.2V5.40741H7.8V1.62963ZM4.96667 17.3704H1.56667V13.5926H4.96667V17.3704ZM11.2 17.3704H7.8V13.5926H11.2V17.3704ZM17.4333 17.3704H14.0333V13.5926H17.4333V17.3704Z"
        fill="#717171"
        stroke="#717171"
        strokeWidth="0.5"
      />
    </svg>
  </React.Fragment>
);

WorkflowSVG.defaultProps = {
  width: 16,
  height: 17,
};

WorkflowSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};
