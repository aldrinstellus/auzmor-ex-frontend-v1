import { INode } from './Chart';
import Avatar from 'components/Avatar';
import Icon from 'components/Icon';
import clsx from 'clsx';
import { FC } from 'react';
import { UserStatus } from 'queries/users';
import { getAvatarColor, getFullName, getProfileImage } from 'utils/misc';
import UserCard, { UsercardVariant } from 'components/UserCard';

interface IUserNode {
  node: { data: INode };
  isFilterApplied: boolean;
  orgName: string;
}

const UserNode: FC<IUserNode> = ({ node, isFilterApplied, orgName }) => {
  const departmentStyle = clsx({
    'bg-orange-100': true,
    'absolute bottom-2 flex px-2 py-1 text-xxs font-semibold rounded': true,
  });
  const userStatusStyle = clsx({
    'absolute top-1 right-1 text-xxs font-medium flex bg-neutral-100 px-1.5 rounded-xl items-center text-neutral-500 py-0.5':
      true,
  });
  const classNane = clsx({
    'flex flex-col rounded-9xl pt-3 px-2 pb-2 bg-white w-full h-full relative group':
      true,
  });
  const getOpacity = () => {
    if (!isFilterApplied) return '1';
    if (
      node?.data?.status === UserStatus.Inactive ||
      !!!node?.data.matchesCriteria
    ) {
      return '0.5';
    }
    return '1';
  };
  if (node.data.parentId !== '' || node.data.id !== 'root') {
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
        <div className="flex overflow-hidden" style={{ opacity: getOpacity() }}>
          <Avatar
            name={
              getFullName({ ...node?.data, fullName: node?.data.userName }) ||
              'U'
            }
            image={getProfileImage({
              ...node?.data,
              profileImage:
                (node?.data?.profileImage as any) === ''
                  ? undefined
                  : node?.data.profileImage,
            })}
            bgColor={getAvatarColor(node?.data)}
          />
          <div className="flex flex-col ml-4">
            <div className="text-sm font-bold">
              {node.data.userName || 'Field not specified'}
            </div>
            <div className="text-xs my-1">
              {node.data.jobTitle?.name || 'Field not specified'}
            </div>
            <div className="flex items-center">
              <div className="mr-1">
                <Icon
                  name="location"
                  size={16}
                  color="!text-neutral-900"
                  hover={false}
                />
              </div>
              <div className="text-xs text-neutral-500 truncate">
                {node?.data?.location || 'Field not specified'}
              </div>
            </div>
          </div>
        </div>
        {node.data?.department && (
          <div className={departmentStyle} style={{ opacity: getOpacity() }}>
            <div>{node.data.department}</div>
          </div>
        )}
        {node?.data?.status && node?.data?.status === UserStatus.Inactive && (
          <div className={userStatusStyle} style={{ opacity: getOpacity() }}>
            <Icon name="cancel" size={12} />{' '}
            <div className="ml-0.5">Deactivated</div>
          </div>
        )}
        <div
          data-testid="hover-user-card"
          className="absolute bottom-full group-hover:visible invisible -translate-x-1/2 ml-[116px] pb-5"
        >
          <UserCard
            variant={UsercardVariant.Large}
            user={{
              id: node.data.id,
              profileImage: node.data.profileImage,
              fullName: node.data.userName,
              department: {
                departmentId: '',
                name: node.data.department || '',
              },
              designation: node.data.jobTitle,
              workLocation: { locationId: '', name: node.data.location || '' },
              status: node.data.status,
            }}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="flex rounded-9xl bg-white w-full h-full relative text-center justify-center items-center">
      <p className="font-extrabold text-base text-neutral-900 text-center">
        {orgName}
      </p>
    </div>
  );
};

export default UserNode;
