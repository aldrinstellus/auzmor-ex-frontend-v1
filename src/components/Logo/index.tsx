import React from 'react';
import OfficeLogoSvg from './images/OfficeLogo.svg';
import SuccessLogo from './images/Vector.svg'

export const Logo = () => {
  return <img src={OfficeLogoSvg} alt="Office Lofo" />;
};

export const Success = () => {
  return <img src={SuccessLogo} alt="Success Logo" />
};