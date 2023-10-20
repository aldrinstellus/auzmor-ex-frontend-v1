import { FC } from 'react';
import { INode } from './Chart';
import Icon from 'components/Icon';

interface IExpandButtonContent {
  node: { data: INode; children?: any };
}

const ExpandButtonContent: FC<IExpandButtonContent> = ({ node }) => {
  return (
    <div className="text-right text-xs text-neutral-500 flex items-center flex-row-reverse">
      <div className="ml-2">
        {node?.children ? (
          <Icon name="arrowUp" size={16} />
        ) : (
          <Icon name="arrowDown" size={16} />
        )}
      </div>
      <div>{node.data.directReporteesCount} direct reports</div>{' '}
    </div>
  );
};

export default ExpandButtonContent;
