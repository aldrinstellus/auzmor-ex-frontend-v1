import React from 'react';
import OfficeLogoSvg from './images/OfficeLogo.svg';
import SuccessLogo from './images/Vector.svg';
import InfoLogo from './images/InfoCircle.svg';
import CheckboxImage from './images/check.svg';

export const Logo = () => {
  return <img src={OfficeLogoSvg} alt="Office Logo" className="h-[68px]" />;
};

export const Success = () => {
  return <img src={SuccessLogo} alt="Success Logo" />;
};

export const Info = () => {
  return <img src={InfoLogo} alt="Info Logo" />;
};

export const Check = () => {
  return <img src={CheckboxImage} alt="Checkbox image" />;
};
