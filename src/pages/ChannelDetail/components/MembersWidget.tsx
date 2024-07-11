import AvatarList from 'components/AvatarList';
import Button, { Size, Variant } from 'components/Button';
import Card from 'components/Card';
import Icon from 'components/Icon';
import useModal from 'hooks/useModal';
import { useInfiniteChannelMembers } from 'queries/channel';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import AddChannelMembersModal from './AddChannelMembersModal';
import { IChannel } from 'stores/channelStore';
import { useChannelRole } from 'hooks/useChannelRole';

export type MembersWidgetProps = {
  channelData: IChannel;
};
const MembersWidget: FC<MembersWidgetProps> = ({ channelData }) => {
  console.log('channelData :', channelData);
  const { isUserAdminOrChannelAdmin } = useChannelRole(channelData);
  const [show, setShow] = useState(true);
  const { t } = useTranslation('channelDetail');
  const { channelId } = useParams();
  const { data } = useInfiniteChannelMembers({
    channelId: channelId,
  });
  const [showAddMemberModal, openAddMemberModal, closeAddMemberModal] =
    useModal(false);
  const users = data?.pages.flatMap((page) => {
    return page?.data?.result?.data.map((user: any) => {
      try {
        return { id: user.id, role: user.role, ...user.user };
      } catch (e) {
        console.log('Error', { user });
      }
    });
  });
  const navigate = useNavigate();
  return (
    <>
      <Card className="py-6 rounded-9xl" shadowOnHover>
        <div className="px-6">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setShow((t) => !t)}
          >
            <div className="font-bold">
              {users?.length} {t('membersWidget.title')}
            </div>
            <Icon
              name={show ? 'arrowUp' : 'arrowDown'}
              size={20}
              color="text-neutral-900"
            />
          </div>
          <div
            className={`transition-max-h duration-300 ease-in-out overflow-hidden ${
              show ? 'max-h-[1000px]' : 'max-h-[0]'
            }`}
          >
            <div className="mt-3">
              <AvatarList
                display={8}
                className="!-space-x-5"
                users={users || []}
                moreCount={users?.length}
              />
            </div>
            <div className="mt-3">
              {isUserAdminOrChannelAdmin ? (
                <Button
                  size={Size.Small}
                  className="w-full"
                  label="Add members"
                  dataTestId="my-teams-cta"
                  leftIcon="addCircle"
                  leftIconClassName="text-white"
                  onClick={() => openAddMemberModal()}
                />
              ) : (
                <Button
                  variant={Variant.Secondary}
                  size={Size.Small}
                  className="w-full"
                  label="View all members"
                  dataTestId="my-teams-cta"
                  onClick={() =>
                    navigate(`/channels/${channelId}/members?type=All_Members`)
                  }
                />
              )}
            </div>
          </div>
        </div>
      </Card>
      {showAddMemberModal && channelData && (
        <AddChannelMembersModal
          open={showAddMemberModal}
          closeModal={closeAddMemberModal}
          channelData={channelData}
        />
      )}
    </>
  );
};

export default MembersWidget;
