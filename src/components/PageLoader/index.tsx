import Spinner from 'components/Spinner';
import useProduct from 'hooks/useProduct';
import { FC, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

interface LoaderProps {
  title?: string;
  inline?: boolean;
  top?: string;
  borderColor?: string;
  size?: 'small' | 'medium' | 'large';
}
const PageLoader: FC<LoaderProps> = ({
  title,
  borderColor = '#616161',
  size = 'medium',
}): ReactElement => {
  const { t } = useTranslation('common');

  const { isLxp } = useProduct();
  const sizeClasses = {
    small: 'w-8 h-8 border-2',
    medium: 'w-12 h-12 border-4',
    large: 'w-16 h-16 border-4',
  };

  const loaderSizeClass = sizeClasses[size];
  if (!isLxp) {
    return (
      <div className="min-w-full min-h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="min-w-full min-h-full flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <div
          className={`
            ${loaderSizeClass}
            rounded-full 
            border-solid
            border-gray-200
            animate-spin
          `}
          style={{
            borderTopColor: borderColor,
          }}
        ></div>

        <div className="mt-2 text-sm font-normal text-center">
          {title || t('loading')}
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
