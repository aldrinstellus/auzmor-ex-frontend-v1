import ContactWidget from 'components/ContactWidget';
import { UserEditType, UserRole } from 'interfaces';
import ProfileInfo from 'components/ProfileInfo';
import {
  Navigate,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import ProfileActivityFeed from './components/ProfileActivityFeed';
import useAuth from 'hooks/useAuth';
import ProfileCoverSection from './components/ProfileCoverSection';
import clsx from 'clsx';
import Tabs from 'components/Tabs';
import UserDetailSkeleton from './components/UserDetailSkeleton';
import ContactSkeleton from 'components/ContactWidget/components/Skeletons';
import useModal from 'hooks/useModal';
import useRole from 'hooks/useRole';
import { FC } from 'react';
import ManagerWidget from 'components/ManagerWidget';
import Recognitions from './components/Recognitions';
import { useTranslation } from 'react-i18next';
import { usePageTitle } from 'hooks/usePageTitle';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';

export interface IUpdateProfileImage {
  profileImage: File;
  coverImage: File;
}

interface IUserDetailProps {}

const UserDetail: FC<IUserDetailProps> = () => {
  const { getApi } = usePermissions();
  const [open, openModal, closeModal] = useModal(undefined, false);
  const { user } = useAuth();
  const { isAdmin } = useRole();
  const params = useParams();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation('profile');
  let editType = UserEditType.NONE;

  const useCurrentUser = getApi(ApiEnum.GetMe);
  const useSingleUser = getApi(ApiEnum.GetUser);

  const isCurrentUserDetail = pathname === '/profile';

  usePageTitle(isCurrentUserDetail ? 'profile' : 'userProfile');

  const { data: userDetail, isLoading } = isCurrentUserDetail
    ? useCurrentUser()
    : useSingleUser(params?.userId || '');

  const data = isCurrentUserDetail
    ? userDetail?.result?.data
    : userDetail?.data?.result?.data;

  const editSection = searchParams.get('edit') || '';

  if (data) {
    editType =
      data?.id === user?.id
        ? UserEditType.COMPLETE
        : isAdmin && data?.role === UserRole.Member
        ? UserEditType.PARTIAL
        : editType;
  }

  const tabStyles = (active: boolean) =>
    clsx(
      {
        'font-medium px-6 cursor-pointer py-1 !font-bold': true,
      },
      {
        'bg-primary-500 rounded-6xl text-white': active,
      },
      {
        'text-neutral-500 bg-neutral-50 rounded-lg hover:text-neutral-900':
          !active,
      },
    );

  const tabs = [
    {
      id: 1,
      tabLabel: (isActive: boolean) => (
        <div className={tabStyles(isActive)}>{t('tabs.profile')}</div>
      ),
      dataTestId: 'user-profile-tab',
      tabContent: (
        <ProfileInfo
          profileDetails={data}
          isLoading={isLoading}
          editType={editType}
          editSection={editSection}
          setSearchParams={setSearchParams}
          searchParams={searchParams}
        />
      ),
    },
    {
      id: 2,
      tabLabel: (isActive: boolean) => (
        <div className={tabStyles(isActive)}>{t('tabs.activity')}</div>
      ),
      dataTestId: 'user-activity-tab',
      tabContent: (
        <ProfileActivityFeed
          pathname={pathname}
          userId={params?.userId || user?.id || ''}
          open={open}
          openModal={openModal}
          closeModal={closeModal}
          data={data}
        />
      ),
    },
    {
      id: 3,
      tabLabel: (isActive: boolean) => (
        <div className={tabStyles(isActive)}>{t('tabs.recognitions')}</div>
      ),
      title: t('tabs.recognitions'),
      dataTestId: 'user-recognitions-tab',
      tabContent: (
        <Recognitions
          pathname={pathname}
          userId={params?.userId || user?.id || ''}
          open={open}
          openModal={openModal}
          closeModal={closeModal}
          data={data}
        />
      ),
    },
  ];

  if (!isLoading && !data) {
    return <Navigate to="/404" />;
  }

  return (
    <div className="flex flex-col space-y-10 w-full">
      {isLoading ? (
        <UserDetailSkeleton />
      ) : (
        <ProfileCoverSection userDetails={data} editSection={editSection} />
      )}

      <div className="mb-32 flex w-full">
        <div className="w-1/4 pr-10 space-y-6">
          <div>
            {isLoading ? (
              <ContactSkeleton />
            ) : (
              <ContactWidget
                contactCardData={data}
                canEdit={pathname === '/profile'}
              />
            )}
          </div>
        </div>
        <div className="w-1/2 px-3">
          <Tabs
            tabs={tabs}
            className="w-fit flex justify-start bg-neutral-50 rounded-8xl border-solid border-1 border-neutral-200 gap-0"
            tabSwitcherClassName="!p-1"
            showUnderline={false}
            tabContentClassName="mt-5"
          />
        </div>
        <div className="w-1/4 pl-12">
          <div>
            <ManagerWidget data={data} canEdit={isAdmin} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
