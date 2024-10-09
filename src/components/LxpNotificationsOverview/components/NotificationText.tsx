import Text from 'components/Text/Text';

const NotificationText = ({ bold = false, children }: any) => {
  const baseClasses = 'text-sm tracking-wide';
  const textColor = bold ? 'text-gray-900' : 'text-gray-600';
  const fontWeight = bold ? 'font-black' : 'font-normal';

  return (
    <Text
      className={`${baseClasses} ${textColor} ${fontWeight}`}
      fontWeight={fontWeight}
    >
      {children}
    </Text>
  );
};

export default NotificationText;
