import React from 'react';
import PropTypes from 'prop-types';

export const EnrollmentNotificationSVG = props => (
  <React.Fragment>
    <svg height={props.height} width={props.width} viewBox="0 0 52 52" fill="none" {...props}>
      <rect width={52} height={52} fill="url(#patternN3)" />
      <defs>
        <pattern id="patternN3" patternContentUnits="objectBoundingBox" width={1} height={1}>
          <use xlinkHref="#imageN3" transform="scale(0.0192308)" />
        </pattern>
        <image id="imageN3" width={52} height={52} xlinkHref="data:image/png;base64,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" />
      </defs>
    </svg>
  </React.Fragment>
);

EnrollmentNotificationSVG.defaultProps = {
  width: 52,
  height: 52,
};

EnrollmentNotificationSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};
