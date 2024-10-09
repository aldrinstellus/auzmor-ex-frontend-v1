import React from 'react';
import PropTypes from 'prop-types';

export const GridViewSVG = props => (
  <React.Fragment>
    <svg height={props.height} width={props.width} viewBox="0 0 20 20" {...props}>
      <defs>
        <path id="Gpath-1" opacity={1} fillRule="evenodd" d="M2,0 L6.707482993197276,0 C7.811313042185276,0 8.707482993197276,0.896169951012 8.707482993197276,2 L8.707482993197276,6.707482993197276 C8.707482993197276,7.811313042185276 7.811313042185276,8.707482993197276 6.707482993197276,8.707482993197276 L2,8.707482993197276 C0.8961699510120003,8.707482993197276 2.220446049250313e-16,7.811313042185276 0,6.707482993197276 L0,2 C0,0.8961699510120003 0.8961699510119996,2.220446049250313e-16 2,0Z" />
        <mask id="mask-2" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x={0} y={0}>
          <rect opacity={1} x={0} y={0} width="19.999999999998636" height={20} fill="black" />
          <use xlinkHref="#Gpath-1" fill="white" />
        </mask>
        <path id="Gpath-3" opacity={1} fillRule="evenodd" d="M13.29251700680129,11.292517006802711 L17.999999999998572,11.292517006802711 C19.103830048986573,11.292517006802711 19.999999999998572,12.188686957814712 19.999999999998572,13.292517006802711 L19.999999999998572,17.999999999999993 C19.999999999998572,19.103830048987994 19.103830048986573,19.999999999999993 17.999999999998572,19.999999999999993 L13.29251700680129,19.999999999999993 C12.18868695781329,19.999999999999993 11.29251700680129,19.103830048987994 11.29251700680129,17.999999999999993 L11.29251700680129,13.292517006802711 C11.29251700680129,12.188686957814712 12.18868695781329,11.292517006802711 13.29251700680129,11.292517006802711Z" />
        <mask id="mask-4" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x={0} y={0}>
          <rect opacity={1} x={0} y={0} width="19.999999999998636" height={20} fill="black" />
          <use xlinkHref="#Gpath-3" fill="white" />
        </mask>
        <path id="Gpath-5" opacity={1} fillRule="evenodd" d="M13.29251700680129,0 L17.999999999998572,0 C19.103830048986573,0 19.999999999998572,0.896169951012 19.999999999998572,2 L19.999999999998572,6.707482993197276 C19.999999999998572,7.811313042185276 19.103830048986573,8.707482993197276 17.999999999998572,8.707482993197276 L13.29251700680129,8.707482993197276 C12.18868695781329,8.707482993197276 11.29251700680129,7.811313042185276 11.29251700680129,6.707482993197276 L11.29251700680129,2 C11.29251700680129,0.8961699510120003 12.18868695781329,2.220446049250313e-16 13.29251700680129,0Z" />
        <mask id="mask-6" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x={0} y={0}>
          <rect opacity={1} x={0} y={0} width="19.999999999998636" height={20} fill="black" />
          <use xlinkHref="#Gpath-5" fill="white" />
        </mask>
        <path id="Gpath-7" opacity={1} fillRule="evenodd" d="M2,11.292517006802711 L6.707482993197276,11.292517006802711 C7.811313042185276,11.292517006802711 8.707482993197276,12.188686957814712 8.707482993197276,13.292517006802711 L8.707482993197276,17.999999999999993 C8.707482993197276,19.103830048987994 7.811313042185276,19.999999999999993 6.707482993197276,19.999999999999993 L2,19.999999999999993 C0.8961699510120003,19.999999999999993 2.220446049250313e-16,19.103830048987994 0,17.999999999999993 L0,13.292517006802711 C0,12.188686957814712 0.8961699510119996,11.292517006802711 2,11.292517006802711Z" />
        <mask id="mask-8" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x={0} y={0}>
          <rect opacity={1} x={0} y={0} width="19.999999999998636" height={20} fill="black" />
          <use xlinkHref="#Gpath-7" fill="white" />
        </mask>
      </defs>
      <g opacity={1}>
        <g opacity={1}>
          <use xlinkHref="#Gpath-1" fillOpacity={0} stroke={props.color} strokeOpacity={1} strokeWidth={3} mask="url(#mask-2)" />
        </g>
        <g opacity={1}>
          <use xlinkHref="#Gpath-3" fillOpacity={0} stroke={props.color} strokeOpacity={1} strokeWidth={3} mask="url(#mask-4)" />
        </g>
        <g opacity={1}>
          <use xlinkHref="#Gpath-5" fillOpacity={0} stroke={props.color} strokeOpacity={1} strokeWidth={3} mask="url(#mask-6)" />
        </g>
        <g opacity={1}>
          <use xlinkHref="#Gpath-7" fillOpacity={0} stroke={props.color} strokeOpacity={1} strokeWidth={3} mask="url(#mask-8)" />
        </g>
      </g>
    </svg>
  </React.Fragment>
);

GridViewSVG.defaultProps = {
  width: 20,
  height: 20,
  color: 'rgb(149,149,149)',
};

GridViewSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
