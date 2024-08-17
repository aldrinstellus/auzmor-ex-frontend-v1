import clsx from 'clsx';
import { FC, MouseEventHandler, useMemo } from 'react';
import Icon from 'components/Icon';

export type ChipsProps = {
  label: string;
  icon?: string;
  onClose?: MouseEventHandler<Element>;
  className?: string;
  onClick?: MouseEventHandler<Element>;
};

const Chip: FC<ChipsProps> = ({
  icon = 'people',
  label,
  className = '',
  onClick = () => {},
  // onClose = () => {},
}) => {
  const styles = useMemo(
    () =>
      clsx(
        {
          'border-solid border-primary-600 bg-primary-200 rounded-full  ': true,
        },
        {
          [className]: true,
        },
      ),
    [],
  );
  return (
    <div onClick={onClick} className={styles}>
      <Icon name={icon} />
      <div>{label}</div>
    </div>
  );
};

export default Chip;
