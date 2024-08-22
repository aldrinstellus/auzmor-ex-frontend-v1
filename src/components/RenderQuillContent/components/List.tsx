import React, { FC, ReactElement } from 'react';
import { DeltaOperation } from 'quill';
import { Text } from './Text';
import Mention from './Mentions';
import { getMentionProps } from '../utils';
import Hashtag from './Hashtag';
import Emoji from './Emoji';
import { ICreatedBy, IMention } from 'queries/post';
import { useTranslation } from 'react-i18next';

interface IListProps {
  op: DeltaOperation;
  mentions: IMention[];
  intendedUsers: ICreatedBy[];
}

const List: FC<IListProps> = ({
  op,
  mentions,
  intendedUsers,
}): ReactElement => {
  const getItem = (
    op: DeltaOperation,
    i: number,
    type: 'ORDERED' | 'UNORDERED',
  ) => {
    const { t } = useTranslation('profile');
    switch (true) {
      case op.insert.hasOwnProperty('mention'):
        return (
          <Mention
            value={op.insert.mention?.value}
            {...getMentionProps(
              mentions,
              intendedUsers,
              op.insert.mention,
              t('fieldNotSpecified'),
            )}
            userId={op.insert.mention.id}
            key={`quill-content-mention-${i}-${op.insert.mention.id}`}
          />
        );
      case op.insert.hasOwnProperty('hashtag'):
        return (
          <Hashtag
            value={op.insert.hashtag?.value}
            key={`quill-content-${i}-hashtag-${op.insert.hashtag?.value}`}
          />
        );
      case op.insert.hasOwnProperty('emoji'):
        return (
          <Emoji value={op.insert.emoji} key={`quill-content-${i}-emoji`} />
        );
      default:
        return (
          <Text
            value={op.insert}
            attributes={op?.attributes}
            isLink={op?.attributes?.link ? true : false}
            link={op?.attributes?.link}
            isHeading={false}
            key={`quill-content-${i}-${type}-list-text-`}
          />
        );
    }
  };
  if (op.attributes?.list === 'ordered') {
    return (
      <ol className="list-decimal">
        {op.insert.map((each: any, i: number) => (
          <li key={`${i}-ordered-li`} className="list-item list-inside pl-4">
            {each.map((eachOp: any) => getItem(eachOp, i, 'ORDERED'))}
          </li>
        ))}
      </ol>
    );
  }
  return (
    <ul className="list-disc">
      {op.insert.map((each: any, i: number) => (
        <li key={`${i}-unordered-li`} className="list-item list-inside pl-4">
          {each.map((eachOp: any) => getItem(eachOp, i, 'UNORDERED'))}
        </li>
      ))}
    </ul>
  );
};

export default List;
