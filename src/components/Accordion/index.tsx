import Card from 'components/Card';
import Icon from 'components/Icon';
import { FC, ReactNode, useState } from 'react';

type AppProps = {
  title: string;
  dataTestId?: string;
  content: ReactNode;
  initialOpen?: boolean;
};

const Accordion: FC<AppProps> = ({
  title,
  dataTestId,
  content,
  initialOpen = true,
}) => {
  const [open, setOpen] = useState(initialOpen);

  return (
    <Card>
      <div
        className="flex justify-between items-center px-4 py-2 bg-blue-50 cursor-pointer"
        data-testid={dataTestId}
        onClick={() => setOpen((t) => !t)}
      >
        <div className="font-bold">{title}</div>
        <div>
          <Icon
            name={open ? 'arrowUp' : 'arrowDown'}
            size={20}
            dataTestId={`${dataTestId}-collapse`}
          />
        </div>
      </div>
      {open && <div>{content}</div>}
    </Card>
  );
};

export default Accordion;
