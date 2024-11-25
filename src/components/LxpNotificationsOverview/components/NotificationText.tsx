import Text from 'components/Text/Text';

const NotificationText = ({ bold = false, children }: any) => {
  const baseClasses = '!text-[13px] !tracking-wide !leading-[18px]';
  const textColor = bold ? 'text-neutral-900 break-all' : 'text-neutral-500';
  const fontWeight = bold ? 'font-semibold' : 'font-normal';

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
