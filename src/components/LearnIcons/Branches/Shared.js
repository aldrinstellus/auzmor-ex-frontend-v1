import PropTypes from 'prop-types';
import React from 'react';

export const SharedSVG = props => (
  <React.Fragment>
    <svg enableBackground="new 0 0 64 64" viewBox="0 0 64 64" width={props.width} height={props.height}>
      <g fill={props.color}>
        <g>
          <path d="m3 42.574v10.604l9.463-6.022c.161-.101.347-.156.537-.156h15.634l11.753-9.945c.389-.329.613-.811.613-1.323 0-.955-.777-1.732-1.732-1.732h-.292c-.399 0-.788.139-1.097.392l-10.246 8.383c-.179.145-.403.225-.633.225h-8v-2h6.706c.714 0 1.294-.58 1.294-1.294 0-.575-.37-1.073-.922-1.238l-7.1-2.13c-.747-.225-1.52-.338-2.299-.338h-.245c-1.416 0-2.81.377-4.031 1.089z" />
        </g>
        <g>
          <path d="m35.366 17-11.753 9.944c-.389.33-.613.813-.613 1.324 0 .955.777 1.732 1.732 1.732h.292c.398 0 .788-.139 1.098-.392l10.245-8.382c.179-.146.403-.226.633-.226h8v2h-6.706c-.714 0-1.294.58-1.294 1.293 0 .576.37 1.074.922 1.239l7.1 2.13c.747.224 1.521.337 2.3.337h.245c1.416 0 2.81-.377 4.031-1.09l9.402-5.483v-10.604l-9.463 6.022c-.161.102-.347.156-.537.156z" />
        </g>
      </g>
    </svg>
  </React.Fragment>
);

SharedSVG.defaultProps = {
  width: '20',
  height: '20',
  color: '#FF3366',
};

SharedSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
