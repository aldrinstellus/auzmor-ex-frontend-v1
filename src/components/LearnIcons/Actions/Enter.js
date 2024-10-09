import React from 'react';
import PropTypes from 'prop-types';

export const EnterSVG = props => (
  <svg width={props.width} height={props.height} viewBox="0 0 256 199" fill="none" {...props}>
    <rect width={256} height={256} fill="url(#pattern0)" />
    <defs>
      <pattern id="pattern0" patternContentUnits="objectBoundingBox" width={1} height={1}>
        <use xlinkHref="#image0" transform="scale(0.00390625)" />
      </pattern>
      <image id="image0" width={256} height={256} xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAQAAAD2e2DtAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAADPklEQVR42u3dvU4UbQCG4dfCwhITS/ypTViRzsoAnYfoUWht609jZ4McAGCJ9GsgmoDZRJchgd37uuYIvplnZu7dJZ9jAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBzzyko2xrvxkOnoWo2jsd8fBkbTkXz7j8a84vjk6dA8fKf/L7884ungAnEHv5Hly7/+fHZBEp3//Ffl98Ecum36JCDqfRbdHwygVL6LX4KeBGE0m+uBerp15nAxnjz38eDUvpVcvDVEv/9m630a+RgeAD/Tr9CDmYHMFv67l/PFogOYGupd//V48d4bgCl9Lt6nIxtr4Ba+l2++3dEYDH9/lz+Fz4GVtPv/OG/M4YBdNPv5RgGUL371/XyhwYg/dIDkH7pAUi/9ACkX3oA0+7+db/8az8A6ZcegPRLD2Dm7i8PQPqlByD90gOQfukBSL/0AHzrlx7AtPTbHsMAVnkA0i89gC2/95cHIP3SA/CtX3oA0i89AOmXHoBv/dIDmEm/8gCkX3oA0i89AOmXHoBv/dIDkH7pAUi/9ACkX3oA0i89AOmXHsCU9JuPj+OtY8HxflUGMOXh77iZY/M2H/4nLkB3AO7+9AC2XP7yAKb8Xz0dKz8AD//0AKRfegDu/vQApF96ANIvPoDX46cT3n4F7I1Tp7wdgfsmUP8YuDvOnPb2F0FeBPmvgvfkYP3HIE+B/M/BcjD/ByFeBPEBeBHkB3A+gSkfCr+ND46Jx6Pb/hPmKU+Bw/HU34Cvvik5+N0E1sGUHDwcT5zAdZjAlBfBMydwHSZwNmECj53A+lNAC8hBJ1AOIgeRg8hB5CByEDmIHGR17cpBOSgH5aAclINyUA7KQTkoB+WgHJSDclAOXuspIAfloBMoB0nnoAnIQROo56AJyEE5KAd9KMx/L+CrITnoBNafAiYgB51AOcjK2/dLoReBCeSfAtd9ERzchX9GnZtogTP3vxxc9u73OSCcgz4GpnPwwMO/nIMufzoHpV86B6VfugWkX3oC3v3pHHT50zko/ZIvglPppwWkX3wCXz382+47BQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADcUb8ASz+29P8ZcwEAAAAASUVORK5CYII=" />
    </defs>
  </svg>
);
EnterSVG.defaultProps = {
  width: 256,
  height: 199,
};

EnterSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};
