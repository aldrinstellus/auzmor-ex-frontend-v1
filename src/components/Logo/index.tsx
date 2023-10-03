import { useMemo } from 'react';
import OfficeLogoSvg from './images/OfficeLogo.svg';
import SuccessLogo from './images/Vector.svg';
import InfoLogo from './images/InfoCircle.svg';
import CheckboxImage from './images/check.svg';
import clsx from 'clsx';

interface IProps {
  className?: string;
}

export const Logo = ({ className = '' }: IProps) => {
  const style = useMemo(
    () =>
      clsx({
        'h-[68px]': true,
        [className]: true,
      }),
    [className],
  );
  return <img src={OfficeLogoSvg} alt="Office Logo" className={style} />;
};

export const Success = () => {
  return <img src={SuccessLogo} alt="Success Logo" className="h-[50px]" />;
};

export const Info = ({ className = '' }: IProps) => {
  const style = useMemo(
    () =>
      clsx({
        'h-[68px]': true,
        [className]: true,
      }),
    [className],
  );
  return <img src={InfoLogo} alt="Info Logo" className={style} />;
};

export const Check = ({ className = '' }: IProps) => {
  const style = useMemo(
    () =>
      clsx({
        'h-[68px]': true,
        [className]: true,
      }),
    [className],
  );
  return <img src={CheckboxImage} alt="Checkbox image" className={style} />;
};
