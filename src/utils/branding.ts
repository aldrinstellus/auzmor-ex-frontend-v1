import { clearFaviconInterval } from 'App';
import { IBranding } from 'contexts/AuthContext';

const tintVariants = {
  50: 0.95, //95%
  100: 0.9, //90%
  200: 0.7, //70%
  300: 0.5, //50%
  400: 0.3, //30%
  600: 0.1, //10%
  700: 0.3, //30%
  800: 0.5, //50%
  900: 0.7, //70%
};

const getTintVariantColor = (
  color: string,
  intensity: number,
  tintColor: 'white' | 'black',
) => {
  /**
   * It will add white or black based on tintColor param to the passed color and return new color mix
   * @param color base color
   * @param intensity ranging from 0 - 1
   * @param tintColor color that we want to add to base color to make it darker or lighter.
   * @returns tinted color
   */
  return `color-mix(in srgb, ${color}, ${tintColor} ${intensity * 100}%)`;
};

const getPalette = (baseColor: string, keyPrefix?: string) => {
  /**
   * Returns a color palette of base color ranging from 50 to 900 where base color is being 500.
   * @param baseColor
   * @param keyPrefix
   * @returns color palette ranging from 50 to 900.
   */
  return {
    [`${keyPrefix}50`]: getTintVariantColor(
      baseColor,
      tintVariants[50],
      'white',
    ),
    [`${keyPrefix}100`]: getTintVariantColor(
      baseColor,
      tintVariants[100],
      'white',
    ),
    [`${keyPrefix}200`]: getTintVariantColor(
      baseColor,
      tintVariants[200],
      'white',
    ),
    [`${keyPrefix}300`]: getTintVariantColor(
      baseColor,
      tintVariants[300],
      'white',
    ),
    [`${keyPrefix}400`]: getTintVariantColor(
      baseColor,
      tintVariants[400],
      'white',
    ),
    [`${keyPrefix}500`]: baseColor,
    [`${keyPrefix}600`]: getTintVariantColor(
      baseColor,
      tintVariants[600],
      'black',
    ),
    [`${keyPrefix}700`]: getTintVariantColor(
      baseColor,
      tintVariants[700],
      'black',
    ),
    [`${keyPrefix}800`]: getTintVariantColor(
      baseColor,
      tintVariants[800],
      'black',
    ),
    [`${keyPrefix}900`]: getTintVariantColor(
      baseColor,
      tintVariants[900],
      'black',
    ),
  };
};

export const applyBranding = (branding: IBranding) => {
  /**
   * apply branding
   */
  const root = document.querySelector(':root') as HTMLElement;
  clearFaviconInterval();
  if (root) {
    if (branding?.primaryColor) {
      // set primary color
      const primaryColorPalette = getPalette(
        branding.primaryColor,
        '--primary-',
      );
      Object.keys(primaryColorPalette).forEach((key: string) => {
        root.style.setProperty(key, primaryColorPalette[key]);
      });
    }
    if (branding?.secondaryColor) {
      // set secondary color
      const secondaryColorPalette = getPalette(
        branding.secondaryColor,
        '--secondary-',
      );
      Object.keys(secondaryColorPalette).forEach((key: string) => {
        root.style.setProperty(key, secondaryColorPalette[key]);
      });
    }
    if (branding?.pageTitle) {
      // set page title
      document.querySelector('title')!.innerHTML = branding.pageTitle;
    }
    if (branding?.favicon) {
      // use brand favicon
      document
        .querySelector('link[rel="icon"]')
        ?.setAttribute('href', branding.favicon);
    } else {
      // use default favicon
      document
        .querySelector('link[rel="icon"]')
        ?.setAttribute('href', '/favicon.ico');
    }
  } else {
    // use default favicon
    document
      .querySelector('link[rel="icon"]')
      ?.setAttribute('href', '/favicon.ico');
  }
};
