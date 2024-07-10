import AdminsWidget from '../AdminsWidget';
import AppLauncher from '../AppLauncher';
import MembersWidget from '../MembersWidget';
import LinksWidget from 'components/LinksWidget';
import Feed from './Feed';
import ChannelRequestWidget from 'components/ChannelRequestWidget';
import { ChannelRequestWidgetModeEnum } from 'components/ChannelRequestWidget/components/ChannelWidgetUser';
import { IChannel } from 'stores/channelStore';
import { FC } from 'react';
import { useChannelRole } from 'hooks/useChannelRole';

type AppProps = {
  channelData: IChannel;
};
const Home: FC<AppProps> = ({ channelData }) => {
  const { isUserAdminOrChannelAdmin } = useChannelRole(channelData);
  return (
    <div className="mb-32  flex w-full">
      <div className="w-1/4 pr-10 space-y-6">
        <AppLauncher />
        <LinksWidget channelData={channelData} />
      </div>
      <div className="w-1/2 px-3">
        <Feed channelData={channelData} />
      </div>
      <div className="w-1/4 pl-10 space-y-6">
        {isUserAdminOrChannelAdmin && (
          <ChannelRequestWidget mode={ChannelRequestWidgetModeEnum.Channel} />
        )}
        <MembersWidget channelData={channelData} />
        <AdminsWidget />
      </div>
    </div>
  );
};

export default Home;
