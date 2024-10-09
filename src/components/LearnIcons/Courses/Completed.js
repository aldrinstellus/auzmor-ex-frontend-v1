import React from 'react';
import PropTypes from 'prop-types';

export const CourseCompletedSVG = (props) => (
  <React.Fragment>
    <svg
      width={props.width}
      height={props.height}
      viewBox="0 0 51 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <mask
        id="completeMask"
        maskUnits="userSpaceOnUse"
        x="0"
        y="1"
        width="50"
        height="46"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.0917969 1.26782H49.4403V46.9118H0.0917969V1.26782Z"
          fill="white"
        />
      </mask>
      <g mask="url(#completeMask)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.68956 21.1849C8.96828 21.0954 9.25055 21.0168 9.53601 20.9503C11.0169 20.6035 13.9009 21.1166 14.8896 19.7161C14.8899 19.7157 27.4417 1.94132 30.0814 1.31395C32.7215 0.686931 32.9729 6.45675 26.5615 18.3732C26.5615 18.3732 45.5435 15.6136 47.8062 17.1188C50.0686 18.6241 46.8006 21.6346 44.6633 23.1399C44.6633 23.1399 49.3147 22.1364 49.4403 25.6487C49.4403 25.6487 49.4403 27.4048 44.5378 29.7879C44.5378 29.7879 47.1775 30.0388 46.4232 32.5476C45.669 35.0564 42.4006 37.0634 40.2637 37.5651C40.2637 37.5651 43.7835 39.8227 40.5151 42.2062C38.4796 43.6902 26.8413 46.6823 11.2154 46.9113C6.5463 46.9796 0.0459414 40.8145 0.0920407 33.0667C0.113672 29.4185 1.84169 25.8571 4.60658 23.4884C5.80126 22.4647 7.19098 21.6658 8.68956 21.1849Z"
          fill="#2EE65B"
        />
      </g>
      <path
        d="M27.8 22.0527C27.8 22.0527 21.1489 25.9702 24.0659 27.9496C26.9833 29.929 39.0074 26.364 44.6638 23.1397"
        stroke="#231F20"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24.014 30.8192C24.014 30.8192 21.1349 34.4939 25.487 34.6273C29.8391 34.761 44.5384 29.7881 44.5384 29.7881"
        stroke="#231F20"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24.6834 35.8298C24.6834 35.8298 21.6033 38.6358 24.6834 39.6383C27.7635 40.6404 40.2643 37.5651 40.2643 37.5651"
        stroke="#231F20"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24.6152 40.9744C24.6152 40.9744 19.3709 44.6689 24.9723 45.9618C24.9723 45.9618 33.0432 45.4993 39.7429 42.6357"
        stroke="#231F20"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.8906 19.716C14.8906 19.716 26.5672 2.59546 30.0825 1.31419C33.5974 0.0329111 31.3502 8.04611 29.8658 11.4183C28.3818 14.7908 26.5626 18.3735 26.5626 18.3735L38.5428 16.9775"
        stroke="#231F20"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.64648 30.5889C7.64648 30.5889 17.6405 31.4763 17.4323 39.8391"
        stroke="#231F20"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </React.Fragment>
);

CourseCompletedSVG.defaultProps = {
  width: 51,
  height: 48,
};

CourseCompletedSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};
