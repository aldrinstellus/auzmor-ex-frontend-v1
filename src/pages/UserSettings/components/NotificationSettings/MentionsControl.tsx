import clsx from 'clsx';
import SwitchToggle from 'components/SwitchToggle';
import { FC } from 'react';

type AppProps = {
  data: Record<string, any>;
};

const MentionsControl: FC<AppProps> = ({ data: _data }) => {
  const settings = [
    {
      label: 'Someone mentions me in a post',
      inApp: 'MENTION_POST_APP',
      email: 'MENTION_POST_EMAIL',
    },
    {
      label: 'Someone mentions me in a comment',
      inApp: 'MENTION_COMMENT_APP',
      email: 'MENTION_COMMENT_EMAIL',
    },
    {
      label: 'Someone mentions me in a team that I am a part of',
      inApp: 'MENTION_TEAM_APP',
      email: 'MENTION_TEAM_EMAIL',
    },
    {
      label: 'Someone comments on a post I am subscribed to',
      inApp: 'MENTION_SUBSCRIBED_COMMENT_APP',
      email: 'MENTION_SUBSCRIBED_COMMENT_EMAIL',
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

export default MentionsControl;
