import AvatarList from 'components/AvatarList';
import Button, { Size, Variant } from 'components/Button';
import Card from 'components/Card';
import Icon from 'components/Icon';
import useRole from 'hooks/useRole';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const MembersWidget = () => {
  const { isAdmin } = useRole();
  const [show, setShow] = useState(true);
  const { t } = useTranslation('channelDetail');

  return (
    <Card className="py-6 rounded-9xl" shadowOnHover>
      <div className="px-6">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShow((t) => !t)}
        >
          <div className="font-bold">23 {t('membersWidget.title')}</div>
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
              users={[
                {
                  id: 1,
                  name: 'Yuki Tanaka                  ',
                  image: 'https://i.pravatar.cc/150?img=30',
                },
                {
                  id: 2,
                  name: 'Alex kim',
                  image: 'https://i.pravatar.cc/150?img=31',
                },
                {
                  id: 3,
                  name: 'winston Smith',
                  image: 'https://i.pravatar.cc/150?img=32',
                },
                {
                  id: 4,
                  name: 'david cummins',
                  image: 'https://i.pravatar.cc/150?img=33',
                },
              ]}
              moreCount={23}
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
