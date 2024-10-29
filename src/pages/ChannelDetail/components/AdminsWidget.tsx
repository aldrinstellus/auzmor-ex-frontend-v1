import Avatar from 'components/Avatar';
import Button, { Size, Variant } from 'components/Button';
import Card from 'components/Card';
import Icon from 'components/Icon';
import useNavigate from 'hooks/useNavigation';
import { usePermissions } from 'hooks/usePermissions';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { CHANNEL_ROLE } from 'stores/channelStore';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { getProfileImage } from 'utils/misc';

const AdminsWidget = () => {
  const navigate = useNavigate();
  const { channelId } = useParams();
  const [show, setShow] = useState(true);
  const { t } = useTranslation('channelDetail');
  const { getApi } = usePermissions();
  const useInfiniteChannelMembers = getApi(ApiEnum.GetChannelMembers);
  const { data } = useInfiniteChannelMembers({
    channelId: channelId,
    q: {
      limit: 3,
      userRole: CHANNEL_ROLE.Admin,
    },
  });
  const admins =
    data?.pages
      .flatMap((page: any) => {
        return page?.data?.result?.data.map((admin: any) => {
          try {
            return { id: admin.id, role: admin.role, ...admin.user };
          } catch (e) {
            console.log('Error', { admin });
            return null;
          }
        });
      })
      .filter(Boolean) || [];

  if (admins?.length == 0) return null;
  const toggleModal = () => setShow((t) => !t);

  return (
    <Card className="py-6 rounded-9xl" shadowOnHover>
      <div className="px-6">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={toggleModal}
          onKeyUp={(e) => (e.code === 'Enter' ? toggleModal() : '')}
          tabIndex={0}
          title={t('adminsWidget.title')}
          aria-expanded={show}
          role="button"
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
          {admins?.slice(0, 3).map((admin: any) => (
            <div key={admin.id} className="flex items-center gap-2 py-2">
              <Avatar
                name={admin.fullName}
                size={32}
                image={getProfileImage(admin)}
              />
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
          <div className="mt-3">
            <Button
              variant={Variant.Secondary}
              size={Size.Small}
              className="w-full"
              label={t('adminsWidget.viewCta')}
              dataTestId="my-admin-cta"
              onClick={() => {
                navigate(
                  `/channels/${channelId}/members?type=All_Members&roles=%255B%257B%2522id%2522%253A%2522ADMIN%2522%252C%2522name%2522%253A%2522Admin%2522%257D%255D`,
                );
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AdminsWidget;
