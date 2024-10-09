import PropTypes from 'prop-types';
import React from 'react';

export const ReminderThumbsUpSVG = props => (
  <React.Fragment>
    <svg
      height={props.height}
      width={props.width}
      viewBox="0 0 22 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11" cy="10.5" r="9.5" fill="#E68201" stroke={props.color} strokeWidth="1.25" />
      <path d="M12.3724 7.1924L11.9141 9.08073H14.5861C14.7285 9.08073 14.8688 9.11386 14.9961 9.1775C15.1234 9.24115 15.2341 9.33355 15.3195 9.4474C15.4049 9.56124 15.4626 9.6934 15.488 9.83342C15.5135 9.97343 15.506 10.1174 15.4661 10.2541L14.3982 13.9207C14.3427 14.1111 14.2269 14.2784 14.0682 14.3974C13.9096 14.5164 13.7166 14.5807 13.5182 14.5807H7.33073C7.08761 14.5807 6.85446 14.4842 6.68255 14.3122C6.51064 14.1403 6.41406 13.9072 6.41406 13.6641V9.9974C6.41406 9.75428 6.51064 9.52112 6.68255 9.34921C6.85446 9.17731 7.08761 9.08073 7.33073 9.08073H8.59573C8.76627 9.08064 8.9334 9.03298 9.07833 8.9431C9.22327 8.85323 9.34026 8.7247 9.41615 8.57198L10.9974 5.41406C11.2135 5.41674 11.4263 5.46822 11.6197 5.56467C11.8132 5.66111 11.9823 5.80003 12.1145 5.97103C12.2468 6.14203 12.3386 6.3407 12.3833 6.5522C12.4279 6.76369 12.4242 6.98254 12.3724 7.1924V7.1924Z" stroke={props.color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </React.Fragment>
);

ReminderThumbsUpSVG.defaultProps = {
  width: 22,
  height: 21,
  color: 'white',
};

ReminderThumbsUpSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
