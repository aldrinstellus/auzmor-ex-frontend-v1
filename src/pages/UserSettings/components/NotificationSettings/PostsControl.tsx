import clsx from 'clsx';
import SwitchToggle from 'components/SwitchToggle';
import { FC } from 'react';

type AppProps = {
  data: Record<string, any>;
};

const PostsControl: FC<AppProps> = ({ data: _data }) => {
  const settings = [
    {
      label: 'Someone comments on my posts',
      inApp: 'MY_POST_COMMENT_APP',
      email: 'MY_POST_COMMENT_EMAIL',
    },
    {
      label: 'Someone reacts on my posts',
      inApp: 'MY_POST_REACT_APP',
      email: 'MY_POST_REACT_EMAIL',
    },
    {
      label: 'Someone re-shares my post',
      inApp: 'MY_POST_RESHARE_APP',
      email: 'MY_POST_RESHARE_EMAIL',
    },
    {
      label: 'Someone gives me a kudos',
      inApp: 'MY_POST_KUDOS_APP',
      email: 'MY_POST_KUDOS_EMAIL',
    },
    {
      label: 'Someone comments on a post I am subscribed to',
      inApp: 'POST_SUBSCRIBED_COMMENT_APP',
      email: 'POST_SUBSCRIBED_COMMENT_APP',
    },
  ];

  return (
    <div className="px-6 py-4">
      <div className="flex text-sm font-bold text-neutral-700 mb-4">
        <div className="flex-1">Actions</div>
        <div className="w-[144px] flex justify-between">
          <div className="">In app</div>
          <div>Email</div>
        </div>
      </div>
      {settings.map((setting, idx) => (
        <div
          key={setting.label}
          className={clsx('flex text-sm text-neutral-900 py-3', {
            'border-b border-neutral-200': idx !== settings.length - 1,
          })}
        >
          <div className="flex-1">{setting.label}</div>
          <div className="w-[144px] flex justify-between">
            <SwitchToggle />
            <SwitchToggle />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostsControl;
