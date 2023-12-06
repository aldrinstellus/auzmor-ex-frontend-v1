import clsx from 'clsx';
import Icon from 'components/Icon';
import useModal from 'hooks/useModal';
import {
  FC,
  LegacyRef,
  ReactElement,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
} from 'react';

type CollapseProps = {
  label: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  headerTextClassName?: string;
  defaultOpen?: boolean;
  dataTestId?: string;
  height: number;
};

const Collapse: FC<CollapseProps> = ({
  label,
  children,
  className,
  headerClassName = '',
  headerTextClassName = '',
  defaultOpen = false,
  dataTestId,
  height = 256,
}): ReactElement => {
  // If you think about it, modal has similar interactivity as collapse
  const [open, openCollpase, closeCollapse] = useModal(defaultOpen);
  const toggleModal = () => {
    if (open) closeCollapse();
    else openCollpase();
  };

  const headerStyle = useMemo(
    () =>
      clsx({
        'flex items-center justify-between cursor-pointer px-6 py-4 bg-white rounded-t-9xl':
          true,
        [headerClassName]: true,
      }),
    [],
  );

  const headerTextStyle = useMemo(
    () =>
      clsx({
        'text-neutral-500 font-bold text-sm': true,
        [headerTextClassName]: true,
      }),
    [],
  );

  const collapseRef: LegacyRef<HTMLDivElement> = useRef(null);

  useEffect(() => {
    if (open && collapseRef.current) {
      setTimeout(
        () => collapseRef.current?.classList.remove('overflow-hidden'),
        400,
      );
    } else {
      collapseRef.current?.classList.add('overflow-hidden');
    }
  }, [open]);

  return (
    <div
      className={`${className} overflow-hidden rounded-9xl transition-all duration-300 ease-in-out`}
      style={{ height: open ? `${height}px` : '56px' }}
      data-testid={dataTestId}
      ref={collapseRef}
    >
      <div className={headerStyle} onClick={toggleModal}>
        <div className={headerTextStyle}>{label}</div>
        <div>
          <Icon name={open ? 'arrowUp' : 'arrowDown'} />
        </div>
      </div>
      <div className={`py-0`}>{children}</div>
    </div>
  );
};

export default Collapse;
