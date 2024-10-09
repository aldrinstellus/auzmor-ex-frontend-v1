import Tooltip from 'components/Tooltip';
import React from 'react';

type FontSize =
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl';
type FontFamily = 'sans' | 'serif' | 'mono';

interface TextProps {
  as?: 'p' | 'span' | 'div' | 'label' | 'h6' | 'h1' | 'a';
  fontSize?: FontSize;
  lineHeight?: string;
  letterSpacing?: string;
  fontWeight?: any;
  fontFamily?: FontFamily;
  color?: string;
  opacity?: number;
  children: React.ReactNode;
  fullText?: string;
  showTooltip?: boolean;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  wordBreak?: 'normal' | 'words' | 'all';
  textDecoration?: string;
  showTitle?: boolean;
  pointer?: boolean;
  className?: string;
}

const Text: React.FC<TextProps> = ({
  as = 'span',
  fontSize = 'base',
  lineHeight = 'normal',
  letterSpacing = 'normal',
  fontWeight = 'normal',
  fontFamily = 'sans',
  color = 'text-gray-900',
  opacity = 100,
  children,
  fullText,
  showTooltip = false,
  tooltipPosition = 'bottom',
  wordBreak = 'normal',
  textDecoration = 'none',
  showTitle = false,
  pointer = false,
  className = '',
  ...rest
}) => {
  const baseClasses = `
    font-${fontFamily}
    text-${fontSize}
    leading-${lineHeight}
    tracking-${letterSpacing}
    font-${fontWeight}
    ${color}
    opacity-${opacity}
    break-${wordBreak}
    ${textDecoration}
    ${pointer ? 'cursor-pointer' : ''}
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ');

  const content = React.createElement(
    as,
    {
      className: baseClasses,
      title: showTitle ? fullText : undefined,
      ...rest,
    },
    children,
  );

  if (showTooltip) {
    return (
      <Tooltip tooltipContent={fullText} tooltipPosition={tooltipPosition}>
        {content}
      </Tooltip>
    );
  }

  return content;
};
export default Text;
