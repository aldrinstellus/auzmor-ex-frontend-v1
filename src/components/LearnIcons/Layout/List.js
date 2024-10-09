import PropTypes from 'prop-types';
import React from 'react';

export const ListViewSVG = props => (
  <React.Fragment>
    <svg height={props.height} width={props.width} viewBox="0 0 20 17" fill="none" {...props}>
      <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
        <g transform="translate(-170.000000, -7754.000000)" fill={props.color} fillRule="nonzero">
          <g transform="translate(170.000000, 7754.000000)">
            <rect id="Rectangle" x={0} y={0} width={20} height={2} rx={1} />
            <rect id="Rectangle-Copy" x={0} y={5} width={20} height={2} rx={1} />
            <rect id="Rectangle-Copy-2" x={0} y={10} width={20} height={2} rx={1} />
            <rect id="Rectangle-Copy-3" x={0} y={15} width={20} height={2} rx={1} />
          </g>
        </g>
      </g>
    </svg>
  </React.Fragment>
);

ListViewSVG.defaultProps = {
  width: 20,
  height: 17,
  color: '#959595',
};

ListViewSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
