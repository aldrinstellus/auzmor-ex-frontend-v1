import Avatar from 'components/Avatar';
import Button, { Size, Variant } from 'components/Button';
import Card from 'components/Card';
import Icon from 'components/Icon';
import { useInfiniteChannelMembers } from 'queries/channel';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Role } from 'utils/enum';

const AdminsWidget = () => {
  const navigate = useNavigate();
  const { channelId } = useParams();
  const [show, setShow] = useState(true);
  const { t } = useTranslation('channelDetail');
  const { data } = useInfiniteChannelMembers({
    channelId: channelId,
    q: {
      limit: 3,
      userRole: Role.Admin,
    },
  });
  const admins =
    data?.pages.flatMap((page) => {
      return page?.data?.result?.data.map((admin: any) => {
        try {
          return { id: admin.id, role: admin.role, ...admin.user };
        } catch (e) {
          console.log('Error', { admin });
        }
      });
    }) || [];

  console.log(data);
  if (admins?.length == 0) return null;
  return (
    <Card className="py-6 rounded-9xl" shadowOnHover>
      <div className="px-6">
        <div
          className="flex items-center justify-between cursor-pointer"
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
          {admins?.slice(0, 3).map((admin) => (
            <div key={admin.id} className="flex items-center gap-2 py-2">
              <Avatar name={admin.fullName} size={32} image={admin.image} />
              <div>
                <div className="text-neutral-900 font-bold text-sm">
                  {admin.fullName}
                </div>
                <div className="text-neutral-500 text-xs">
                  {admin.designation}
                </div>
              </div>
              {admin?.isOwner && (
                <div className="bg-black px-2 py-[2px] rounded-xl text-white font-medium text-xxs">
                  {t('adminsWidget.owner')}
                </div>
              )}
            </div>
          ))}
          {admins?.length > 3 && (
            <div className="mt-3">
              <Button
                variant={Variant.Secondary}
                size={Size.Small}
                className="w-full"
                label="View all admins"
                dataTestId="my-admin-cta"
                onClick={() => {
                  navigate(`/channels/${channelId}/members?type=All_Members`);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AdminsWidget;
