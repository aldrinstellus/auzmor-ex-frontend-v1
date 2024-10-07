import React from 'react';
import PropTypes from 'prop-types';

export const AssignmentNotificationSVG = props => (
  <React.Fragment>
    <svg height={props.height} width={props.width} viewBox="0 0 52 52" fill="none" {...props}>
      <rect width={52} height={52} fill="url(#patternN1)" />
      <defs>
        <pattern id="patternN1" patternContentUnits="objectBoundingBox" width={1} height={1}>
          <use xlinkHref="#imageN1" transform="scale(0.0192308)" />
        </pattern>
        <image id="imageN1" width={52} height={52} xlinkHref="data:image/png;base64,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" />
      </defs>
    </svg>
  </React.Fragment>
);

AssignmentNotificationSVG.defaultProps = {
  width: 52,
  height: 52,
};

AssignmentNotificationSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};
