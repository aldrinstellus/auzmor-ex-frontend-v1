import AvatarList from 'components/AvatarList';
import Button, { Size, Variant } from 'components/Button';
import Card from 'components/Card';
import Icon from 'components/Icon';
import useModal from 'hooks/useModal';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import AddChannelMembersModal from './AddChannelMembersModal';
import { IChannel } from 'stores/channelStore';
import useNavigate from 'hooks/useNavigation';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { ChannelPermissionEnum } from './utils/channelPermission';

export type MembersWidgetProps = {
  channelData: IChannel;
  permissions: ChannelPermissionEnum[];
};
const MembersWidget: FC<MembersWidgetProps> = ({
  channelData,
  permissions,
}) => {
  const [show, setShow] = useState(true);
  const { t } = useTranslation('channelDetail');
  const { channelId } = useParams();
  const { getApi } = usePermissions();
  const useInfiniteChannelMembers = getApi(ApiEnum.GetChannelMembers);
  const { data } = useInfiniteChannelMembers({
    channelId: channelId,
  });
  const [showAddMemberModal, openAddMemberModal, closeAddMemberModal] =
    useModal(false);
  const users = data?.pages.flatMap((page: any) => {
    return page?.data?.result?.data.map((user: any) => {
      try {
        return { id: user.id, role: user.role, ...user.user };
      } catch (e) {
        console.log('Error', { user });
      }
    });
  });
  const navigate = useNavigate();

  const toggleWidget = () => setShow((t) => !t);
  return (
    <>
      <Card className="py-6 rounded-9xl" shadowOnHover>
        <div className="px-6">
          <div
            className="flex items-center justify-between cursor-pointer"
            data-testid="app-launcher"
            onClick={toggleWidget}
            onKeyUp={(e) => (e.code === 'Enter' ? toggleWidget() : '')}
            tabIndex={0}
            title="channel members"
            aria-expanded={show}
            role="button"
          >
            <div className="font-bold">
              {t('membersWidget.title', {
                count: data?.pages[0]?.data?.result?.totalCount,
              })}
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
                className="!-space-x-5"
                users={users || []}
                moreCount={data?.pages[0]?.data?.result?.totalCount}
              />
            </div>
            <div className="mt-3">
              {permissions.includes(ChannelPermissionEnum.CanAddMember) ? (
                <Button
                  size={Size.Small}
                  className="w-full"
                  label={t('membersWidget.addMemberCta')}
                  dataTestId="my-teams-cta"
                  leftIcon="addCircle"
                  leftIconClassName="text-white"
                  iconColor="!text-white"
                  onClick={() => openAddMemberModal()}
                />
              ) : (
                <Button
                  variant={Variant.Secondary}
                  size={Size.Small}
                  className="w-full"
                  label={t('membersWidget.viewCta')}
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
