import React from 'react';
import PropTypes from 'prop-types';

export const DragSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 23 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M2.5 5C3.88071 5 5 3.88071 5 2.5C5 1.11929 3.88071 0 2.5 0C1.11929 0 0 1.11929 0 2.5C0 3.88071 1.11929 5 2.5 5Z" fill="#D8D8D8" />
      <path d="M2.5 14C3.88071 14 5 12.8807 5 11.5C5 10.1193 3.88071 9 2.5 9C1.11929 9 0 10.1193 0 11.5C0 12.8807 1.11929 14 2.5 14Z" fill="#D8D8D8" />
      <path d="M11.5 5C12.8807 5 14 3.88071 14 2.5C14 1.11929 12.8807 0 11.5 0C10.1193 0 9 1.11929 9 2.5C9 3.88071 10.1193 5 11.5 5Z" fill="#D8D8D8" />
      <path d="M11.5 14C12.8807 14 14 12.8807 14 11.5C14 10.1193 12.8807 9 11.5 9C10.1193 9 9 10.1193 9 11.5C9 12.8807 10.1193 14 11.5 14Z" fill="#D8D8D8" />
      <path d="M20.5 5C21.8807 5 23 3.88071 23 2.5C23 1.11929 21.8807 0 20.5 0C19.1193 0 18 1.11929 18 2.5C18 3.88071 19.1193 5 20.5 5Z" fill="#D8D8D8" />
      <path d="M20.5 14C21.8807 14 23 12.8807 23 11.5C23 10.1193 21.8807 9 20.5 9C19.1193 9 18 10.1193 18 11.5C18 12.8807 19.1193 14 20.5 14Z" fill="#D8D8D8" />
    </svg>
  </React.Fragment>
);

DragSVG.defaultProps = {
  width: 23,
  height: 14,
};

DragSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};
