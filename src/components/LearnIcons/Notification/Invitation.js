import React from 'react';

export function InviteNotificationSVG(props) {
  const uniqueId = `N${Math.random().toString(36).substr(2, 9)}`;
  return (
    <svg width={52} height={52} viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" {...props}>
      <rect width={52} height={52} fill={`url(#patternN6${uniqueId})`} />
      <defs>
        <pattern id={`patternN6${uniqueId}`} patternContentUnits="objectBoundingBox" width={1} height={1}>
          <use xlinkHref={`#imageN6${uniqueId}`} transform="scale(0.0192308)" />
        </pattern>
        <image id={`imageN6${uniqueId}`} width={52} height={52} xlinkHref="data:image/png;base64,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" />
      </defs>
    </svg>
  );
}
