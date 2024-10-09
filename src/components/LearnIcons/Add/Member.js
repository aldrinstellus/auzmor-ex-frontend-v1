import PropTypes from 'prop-types';
import React from 'react';

export const AddMemberSVG = props => (
  <React.Fragment>
    <svg height={props.height} width={props.width} viewBox="0 0 20 16" {...props}>
      <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
        <g transform="translate(-524.000000, -7560.000000)">
          <g transform="translate(522.000000, 7556.000000)">
            <polygon points="0 0 24 0 24 24 0 24" />
            <path d="M21.5,10.5 L19.5,10.5 L19.5,8.5 C19.5,8.225 19.275,8 19,8 L18,8 C17.725,8 17.5,8.225 17.5,8.5 L17.5,10.5 L15.5,10.5 C15.225,10.5 15,10.725 15,11 L15,12 C15,12.275 15.225,12.5 15.5,12.5 L17.5,12.5 L17.5,14.5 C17.5,14.775 17.725,15 18,15 L19,15 C19.275,15 19.5,14.775 19.5,14.5 L19.5,12.5 L21.5,12.5 C21.775,12.5 22,12.275 22,12 L22,11 C22,10.725 21.775,10.5 21.5,10.5 Z M9,12 C11.209375,12 13,10.209375 13,8 C13,5.790625 11.209375,4 9,4 C6.790625,4 5,5.790625 5,8 C5,10.209375 6.790625,12 9,12 Z M11.8,13 L11.278125,13 C10.584375,13.31875 9.8125,13.5 9,13.5 C8.1875,13.5 7.41875,13.31875 6.721875,13 L6.2,13 C3.88125,13 2,14.88125 2,17.2 L2,18.5 C2,19.328125 2.671875,20 3.5,20 L14.5,20 C15.328125,20 16,19.328125 16,18.5 L16,17.2 C16,14.88125 14.11875,13 11.8,13 Z" id="MemberShape" fill={props.color} fillRule="nonzero" />
          </g>
        </g>
      </g>
    </svg>
  </React.Fragment>
);

AddMemberSVG.defaultProps = {
  width: 20,
  height: 16,
  color: '#101010',
};

AddMemberSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
