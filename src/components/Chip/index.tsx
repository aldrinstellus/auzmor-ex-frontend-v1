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
  icon = '>',
  label,
  className = '',
  onClick = () => {},
  // onClose = () => {},
}) => {
  const styles = useMemo(
    () =>
      clsx(
        {
          'border-solid border-primary-600 bg-primary-200 rounded-full w-[10rem] p-[0.5rem] justify-around flex':
            true,
        },
        {
          [className]: true,
        },
      ),
    [],
  );
  return (
    <div onClick={onClick} className={styles}>
      <Icon name="people" />
      {/* <div>{icon}</div> */}
      <div>{label}</div>
      <div>{icon}</div>
    </div>
  );
};

export default Chip;
