import Avatar from 'components/Avatar';
import Card from 'components/Card';
import Icon from 'components/Icon';
import { useInfiniteChannelMembers } from 'queries/channel';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Role } from 'utils/enum';

const AdminsWidget = () => {
  const { channelId } = useParams();
  const [show, setShow] = useState(true);
  const { t } = useTranslation('channelDetail');
  const { data } = useInfiniteChannelMembers({
    channelId: channelId,
    q: {
      limit: 3,
      role: Role.Admin,
    },
  });
  const admins = data?.pages.flatMap((page) => {
    return page?.data?.result?.data.map((admin: any) => {
      try {
        return admin;
      } catch (e) {
        console.log('Error', { admin });
      }
    });
  });
  if (!admins) return null;
  return (
    <Card className="py-6 rounded-9xl" shadowOnHover>
      <div className="px-6">
        <div
          className="flex items-center justify-between cursor-pointer mb-3"
          onClick={() => setShow((t) => !t)}
        >
          <div className="font-bold">{t('adminsWidget.title')}</div>
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
          <div className="space-y-3">
            {admins?.slice(0, 3).map((admin) => (
              <div key={admin.id} className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <Avatar name={admin.name} size={32} image={admin.image} />
                  <div>
                    <div className="text-neutral-900 font-bold text-sm">
                      {admin.name}
                    </div>
                    <div className="text-neutral-500 text-xs">
                      {admin.designation}
                    </div>
                  </div>
                </div>
                {admin.isOwner && (
                  <div className="bg-black px-2 py-[2px] rounded-xl text-white font-medium text-xxs">
                    {t('adminsWidget.owner')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AdminsWidget;
