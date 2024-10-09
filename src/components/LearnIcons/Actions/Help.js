import PropTypes from 'prop-types';
import React from 'react';

export const HelpSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
        <g transform="translate(-737.000000, -1263.000000)" fillRule="nonzero">
          <g transform="translate(744.000000, 1270.000000) scale(1, -1) translate(-744.000000, -1270.000000) translate(737.000000, 1263.000000)">
            <g>
              <g>
                <circle fill={props.color} cx={7} cy={7} r={7} />
                <path d="M7.00044048,3.06992386 C6.49908059,3.06992386 6.11973264,3.33156677 6.11973264,3.75417928 L6.11973264,7.63041943 C6.11973264,8.05347242 6.49903165,8.31423438 7.00044048,8.31423438 C7.48956491,8.31423438 7.88114831,8.0425584 7.88114831,7.63041943 L7.88114831,3.75417928 C7.88109937,3.34159984 7.48956491,3.06992386 7.00044048,3.06992386 Z M7.00044048,9.18750306 C6.5187552,9.18750306 6.12673132,9.57952694 6.12673132,10.0616038 C6.12673132,10.5428486 6.5187552,10.9348724 7.00044048,10.9348724 C7.48212575,10.9348724 7.87370916,10.5428486 7.87370916,10.0616038 C7.87366022,9.579478 7.48212575,9.18750306 7.00044048,9.18750306 Z" id="HelpShape" fill="#FFFFFF" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  </React.Fragment>
);

HelpSVG.defaultProps = {
  width: 14,
  height: 14,
  color: '#757575',
};

HelpSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
