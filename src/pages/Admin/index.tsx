import Card from 'components/Card';
import Collapse from 'components/Collapse';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import SSOSettings from 'components/SSOSettings';
import Spinner from 'components/Spinner';
import SwitchToggle from 'components/SwitchToggle';
import {
  useOrganization,
  useUpdateLimitGlobalPostingMutation,
} from 'queries/organization';
import { FC, useMemo, useState } from 'react';
import queryClient from 'utils/queryClient';
interface IAdminProps {}

// interface ISetting {
//   label: string;
//   icon: string;
//   key: string;
//   component: ReactNode;
//   disabled: boolean;
//   hidden: boolean;
//   dataTestId?: string;
// }

const Admin: FC<IAdminProps> = () => {
  const updateLimitPostingControlsMutation =
    useUpdateLimitGlobalPostingMutation();
  const { data, isLoading } = useOrganization();
  const settings = useMemo(
    () => [
      {
        label: 'General settings',
        icon: 'gearOutline',
        key: 'general-settings',
        component: (
          <Collapse
            defaultOpen
            label="Posting controls"
            className="rounded-9xl overflow-hidden"
            headerClassName="px-4 py-2 bg-blue-50"
            headerTextClassName="text-base font-bold text-neutral-900"
            dataTestId="generalsetting-postingcontrols"
          >
            <div className="bg-white">
              <div className="px-6 py-4 flex justify-between">
                <div className="flex flex-col">
                  <div className="text-neutral-900 font-semibold text-sm">
                    Limit global posting
                  </div>
                  <div
                    className="text-xs text-neutral-900"
                    data-testid="globalposting-helpnote"
                  >
                    When Global Posting is ON, end users can&apos;t post to
                    everyone, only to their Team(s) or permitted Channels.
                  </div>
                </div>
                {isLoading ? (
                  <Spinner />
                ) : (
                  <SwitchToggle
                    onChange={(checked: boolean, setChecked) =>
                      updateLimitPostingControlsMutation.mutate(checked, {
                        onError: () => setChecked(!checked),
                        onSuccess: () =>
                          queryClient.invalidateQueries(['organization']),
                      })
                    }
                    defaultValue={
                      !!data?.adminSettings?.postingControls?.limitGlobalPosting
                    }
                    dataTestId="postingcontrols-globalposting-cta"
                  />
                )}
              </div>
            </div>
          </Collapse>
        ),
        disabled: false,
        hidden: false,
        dataTestId: 'adminsettings-generalsetting',
      },
      {
        label: 'User Management',
        icon: 'userManagement',
        key: 'user-management-settings',
        component: <div>User Management Settings Page</div>,
        disabled: false,
        hidden: true,
        dataTestId: 'settings-user-management',
      },
      {
        label: 'Branding',
        icon: 'branding',
        key: 'branding-settings',
        component: <div>Branding Settings Page</div>,
        disabled: false,
        hidden: true,
        dataTestId: 'settings-branding',
      },
      {
        label: 'Single Sign-on',
        icon: 'link',
        key: 'single-sign-on-settings',
        component: <SSOSettings />,
        disabled: false,
        hidden: false,
        dataTestId: 'settings-sso',
      },
      {
        label: 'Marketplace',
        icon: 'marketplace',
        key: 'marketplace-settings',
        component: <div>Marketplace Settings Page</div>,
        disabled: false,
        hidden: true,
        dataTestId: 'settings-marketplace',
      },
      {
        label: 'Notifications',
        icon: 'notification',
        key: 'notifications-settings',
        component: <div>Notifications Settings Page</div>,
        disabled: false,
        hidden: true,
        dataTestId: 'settings-notifications',
      },
    ],
    [data, isLoading],
  );

  const [activeSettingsIndex, setActiveSettingsIndex] = useState<number>(0);

  const visibleSettings = settings.filter((item) => !item.hidden);

  return (
    <div
      className="flex justify-between w-full gap-x-14"
      data-testid="admin-settings"
    >
      <Card
        className="min-w-[300px] h-full"
        dataTestId="admin-settings-controls"
      >
        <p className="text-neutral-900 text-base font-bold p-4">
          Admin Settings
        </p>
        <Divider className="border-neutral-500" />
        <div className="flex flex-col">
          {visibleSettings.map((item, index) => (
            <div
              key={item.key}
              className={`hover:bg-primary-50 cursor-pointer ${
                item.key === visibleSettings[activeSettingsIndex].key
                  ? 'bg-primary-50'
                  : 'bg-white'
              } ${index === visibleSettings.length - 1 ? 'rounded-b-9xl' : ''}`}
              onClick={() => setActiveSettingsIndex(index)}
              data-testid={item.dataTestId}
            >
              <div
                className={`${
                  item.key === visibleSettings[activeSettingsIndex].key
                    ? 'text-primary-500'
                    : 'text-neutral-500'
                } text-sm font-medium p-4 flex items-center gap-x-3`}
              >
                <Icon
                  name={item.icon}
                  isActive={
                    visibleSettings[activeSettingsIndex].key === item.key
                  }
                />
                {item.label}
              </div>
              {index !== visibleSettings.length - 1 && <Divider />}
            </div>
          ))}
        </div>
      </Card>
      <div className="flex flex-col w-full gap-y-4">
        <Card className="max-h-14 text-neutral-900 text-base font-bold py-4 pl-6">
          {visibleSettings[activeSettingsIndex].label}
        </Card>
        {visibleSettings[activeSettingsIndex].component}
      </div>
    </div>
  );
};

export default Admin;
