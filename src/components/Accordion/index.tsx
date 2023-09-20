import Card from 'components/Card';
import Icon from 'components/Icon';
import { FC, ReactNode, useState } from 'react';

type AppProps = {
  title: string;
  content: ReactNode;
  initialOpen?: boolean;
};

const Accordion: FC<AppProps> = ({ title, content, initialOpen = true }) => {
  const [open, setOpen] = useState(initialOpen);

  return (
    <Card>
      <div
        className="flex justify-between items-center px-4 py-2 bg-blue-50 cursor-pointer"
        onClick={() => setOpen((t) => !t)}
      >
        <div className="font-bold">{title}</div>
        <div>
          <Icon name={open ? 'arrowUp' : 'arrowDown'} size={20} />
        </div>
      </div>
      {open && <div>{content}</div>}
    </Card>
  );
};

export default Accordion;
