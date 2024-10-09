import PropTypes from 'prop-types';
import React from 'react';

export const CourseOutlinedSVG = props => (
  <svg width={props.width} height={props.height} {...props}>
    <defs>
      <path d="M.07.064h3.75v6.467H.07z" />
    </defs>
    <g fill="none" fillRule="evenodd">
      <path
        d="M21.525 5.876h3.183l-.381 26.236H7.368l-.002.006c-.154.016-2.367-.006-2.527-.006-1.956 0-3.543-1.187-3.543-2.65"
        stroke="#231F20"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.61 9.465l.088-5.716c0-1.463 1.445-2.686 3.543-2.65l16.398.03v7.05"
        fill="#FFF"
      />
      <path
        d="M1.61 9.465l.088-5.716c0-1.463 1.445-2.686 3.543-2.65l16.398.03v7.05"
        stroke="#231F20"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.64 18.093v8.58H5.271c-.873 0-1.741.208-2.496.649-.727.425-1.422 1.1-1.48 2.14l.145-9.255"
        fill="#FFF"
      />
      <path
        d="M21.64 18.093v8.58H5.271c-.873 0-1.741.208-2.496.649-.727.425-1.422 1.1-1.48 2.14l.145-9.255"
        stroke="#231F20"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.19 12.009c0-1.463 1.953-2.58 4.05-2.544h16.132c.422 0 .764.342.764.765v5.94a.765.765 0 01-.764.766H6.72c-1.642 0-3.408.57-4.646 1.65a5.342 5.342 0 00-.329.31c-.219.226-.603.059-.598-.256.03-2.208.044-6.537.044-6.631"
        fill={props.color}
      />
      <path fill="#FFF" d="M19.203 29.523h2.732" />
      <path
        stroke="#231F20"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.203 29.523h2.732"
      />
      <g>
        <path fill="#FFF" d="M4.5 29.523h9.057" />
        <path
          stroke="#231F20"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 29.523h9.057"
        />
      </g>
      <g transform="translate(14.435 28.712)">
        <mask id="courseOutlined_svg__b" fill="#fff">
          <use xlinkHref="#courseOutlined_svg__a" />
        </mask>
        <path
          d="M.448.064H3.54c.154 0 .28.125.28.28v5.96a.225.225 0 01-.394.151L1.889 4.74.467 6.414a.225.225 0 01-.397-.15L.17.34A.279.279 0 01.447.064"
          fill={props.color}
          mask="url(#courseOutlined_svg__b)"
        />
      </g>
    </g>
  </svg>
);

CourseOutlinedSVG.defaultProps = {
  width: 26,
  height: 36,
  color: '#F36',
};

CourseOutlinedSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
