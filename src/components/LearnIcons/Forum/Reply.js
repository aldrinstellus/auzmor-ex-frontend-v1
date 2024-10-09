import React from 'react';
import PropTypes from 'prop-types';

export const ReplySVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.66667 4.33479V1.50016C7.66667 1.29949 7.546 1.11816 7.36133 1.0395C7.17733 0.961498 6.962 1.00083 6.81867 1.1415L1.152 6.64143C1.05467 6.73543 1 6.86476 1 7.00009C1 7.13542 1.05467 7.26475 1.152 7.35875L6.81867 12.8587C6.96333 12.9987 7.178 13.038 7.36133 12.9607C7.546 12.882 7.66667 12.7007 7.66667 12.5V9.66672H8.612C11.7027 9.66672 14.552 11.3467 16.0473 14.048L16.0613 14.0733C16.1507 14.236 16.32 14.3333 16.5 14.3333C16.5413 14.3333 16.5827 14.3287 16.624 14.318C16.8453 14.2613 17 14.062 17 13.8333C17 8.65074 12.8287 4.42412 7.66667 4.33479Z" stroke={props.color} strokeLinejoin="round" />
    </svg>
  </React.Fragment>
);

ReplySVG.defaultProps = {
  width: 18,
  height: 15,
  color: '#000',
};

ReplySVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
