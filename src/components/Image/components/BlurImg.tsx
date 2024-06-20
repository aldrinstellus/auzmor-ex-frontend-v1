import useBlurhash from 'hooks/useBlurhash';
import {
  useState,
  useCallback,
  ReactElement,
  FC,
  DetailedHTMLProps,
  ImgHTMLAttributes,
} from 'react';
import { useInView } from 'react-intersection-observer';

type Props = DetailedHTMLProps<
  ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> & { blurhash?: string | null; dataTestId?: string; ariaLabel?: string };

// Uses browser-native `loading="lazy"` to lazy load images
// Renders a blurhash value to a blob when it about to appear on screen.
// Only renders the blurhash when the image hasn't loaded yet.
// Removes the blob once the image has finished loading.
const BlurImg: FC = (allProps: Props): ReactElement => {
  const { loading = 'lazy', blurhash, style, ariaLabel, ...props } = allProps;

  const [imgLoaded, setImgLoaded] = useState(false);
  const [ref, inView] = useInView({ rootMargin: '110%' });
  const blurUrl = useBlurhash(!imgLoaded && inView ? blurhash : null);

  const handleOnLoad = useCallback(() => {
    setImgLoaded(true);
  }, []);

  const newStyle = blurUrl
    ? {
        ...style,
        backgroundImage: `url("${blurUrl}")`,
        backgroundSize:
          props.width && props.height
            ? `${props.width}px ${props.height}px`
            : '100% 100%',
      }
    : style;

  return (
    <img
      ref={ref}
      {...props}
      loading={loading}
      onLoad={handleOnLoad}
      style={newStyle}
      data-testid={allProps?.dataTestId}
      alt="Image"
      aria-label={ariaLabel}
    />
  );
};

export default BlurImg;
