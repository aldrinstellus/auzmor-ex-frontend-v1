import React, { FC, ReactElement } from 'react';
import { DeltaOperation } from 'quill';
import { Text } from './Text';

interface IListProps {
  op: DeltaOperation;
}

const List: FC<IListProps> = ({ op }): ReactElement => {
  if (op.attributes?.listType === 'ordered') {
    return (
      <ol className="list-decimal">
        {op.insert.map((each: any, i: number) => (
          <li key={each.insert} className="list-item list-inside pl-4">
            <Text
              value={each.insert}
              attributes={each?.attributes}
              isLink={each?.attributes?.link ? true : false}
              link={each?.attributes?.link}
              isHeading={false}
              key={`quill-content-${i}-ordered-list-text`}
            />
          </li>
        ))}
      </ol>
    );
  }
  return (
    <ul className="list-disc">
      {op.insert.map((each: any, i: number) => (
        <li key={each.insert} className="list-item list-inside pl-4">
          <Text
            value={each.insert}
            attributes={each?.attributes}
            isLink={each?.attributes?.link ? true : false}
            link={each?.attributes?.link}
            isHeading={false}
            key={`quill-content-${i}-unordered-list-text`}
          />
        </li>
      ))}
    </ul>
  );
};

export default List;
