import { useMemo } from 'react';
import OfficeLogoSvg from './images/OfficeLogo.svg';
import LxpLogoSvg from './images/lxpLogo.svg';
import SuccessLogo from './images/Vector.svg';
import InfoLogo from './images/InfoCircle.svg';
import CheckboxImage from './images/check.svg';
import clsx from 'clsx';
import { useBrandingStore } from 'stores/branding';
import useProduct from 'hooks/useProduct';

interface IProps {
  className?: string;
}

export const Logo = ({ className = '' }: IProps) => {
  const { isLxp } = useProduct();
  const branding = useBrandingStore((state) => state.branding);
  const style = useMemo(
    () =>
      clsx({
        'h-[64px]': true,
        [className]: true,
        'py-3': isLxp,
      }),
    [className, isLxp],
  );
  return (
    <img
      src={branding?.logo?.original || (isLxp ? LxpLogoSvg : OfficeLogoSvg)}
      alt="Office Logo"
      className={style}
    />
  );
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
