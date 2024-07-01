import AvatarList from 'components/AvatarList';
import Button, { Size, Variant } from 'components/Button';
import Card from 'components/Card';
import Icon from 'components/Icon';
import useRole from 'hooks/useRole';
import { useInfiniteChannelMembers } from 'queries/channel';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
// import { Role } from 'utils/enum';

const MembersWidget = () => {
  const { isAdmin } = useRole();
  const [show, setShow] = useState(true);
  const { t } = useTranslation('channelDetail');
  const { channelId } = useParams();
  const { data } = useInfiniteChannelMembers({
    channelId: channelId,
  });
  const users = data?.pages.flatMap((page) => {
    return page?.data?.result?.data.map((user: any) => {
      try {
        return { id: user.id, role: user.role, ...user.user };
      } catch (e) {
        console.log('Error', { user });
      }
    });
  });

  return (
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
            {isAdmin ? (
              <Button
                size={Size.Small}
                className="w-full"
                label="Add members"
                dataTestId="my-teams-cta"
                leftIcon="addCircle"
                leftIconClassName="text-white"
                // onClick={() => navigate('/teams?tab=myTeams')}
              />
            ) : (
              <Button
                variant={Variant.Secondary}
                size={Size.Small}
                className="w-full"
                label="View all members"
                dataTestId="my-teams-cta"
                // onClick={() => navigate('/teams?tab=myTeams')}
              />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MembersWidget;
