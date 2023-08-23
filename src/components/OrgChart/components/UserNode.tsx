import React from 'react';
import { INode } from './Chart';
import Avatar from 'components/Avatar';
import { Logo } from 'components/Logo';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import clsx from 'clsx';

interface IUserNode {
  node: { data: INode };
}

const UserNode: React.FC<IUserNode> = ({ node }) => {
  const departmentStyle = clsx({
    'bg-neutral-100': true,
    'bg-pink-100 text-pink-500':
      node.data?.department?.name.toLowerCase() === 'marketing',
    'absolute bottom-2 flex px-2 py-0.5 text-xxs font-semibold rounded': true,
  });
  const classNane = clsx({
    'flex flex-col rounded-9xl pt-3 px-2 pb-2 bg-white w-full h-full relative':
      true,
  });
  if (node.data.parentId !== '') {
    return (
      <div
        id={node.data.id}
        className={classNane}
        style={{
          backgroundColor: !!node?.data?._upToTheRootHighlightedNode
            ? '#F0F8FF'
            : 'white',
        }}
      >
        <div className="flex">
          <Avatar name={node.data.userName} image={node.data.profileImage} />
          <div className="flex flex-col ml-4">
            <div className="text-sm font-bold">
              {node.data.userName || 'Isabel Marcado'}
            </div>
            <div className="text-sm my-1">Sales Director</div>
            <div className="flex items-center">
              <div className="mr-1">
                <Icon name="location" size={24} color="#171717" />
              </div>
              <div className="text-sm text-neutral-500">San Francisco</div>
            </div>
          </div>
        </div>
        {node.data?.department?.name && (
          <div className={departmentStyle}>
            <div>{node.data.department.name}</div>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-col rounded-9xl bg-white w-full h-full relative">
      <div className="mt-4 mb-1 flex justify-center h-8">
        <Logo />
      </div>
      <Divider />
      <div className="flex justify-center my-1 font-extrabold text-sm text-neutral-900">
        Auzmor Office
      </div>
      <Divider />
    </div>
  );
};

export default UserNode;
