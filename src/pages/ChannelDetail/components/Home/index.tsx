import AdminsWidget from '../AdminsWidget';
import AppLauncher from '../AppLauncher';
import MembersWidget from '../MembersWidget';
import LinksWidget from 'components/LinksWidget';
import Feed from './Feed';
import ChannelRequestWidget from 'components/ChannelRequestWidget';
import useRole from 'hooks/useRole';

const Home = () => {
  const { isAdmin } = useRole();
  return (
    <div className="mb-32 flex w-full">
      <div className="w-1/4 pr-10 space-y-6">
        <AppLauncher />
        <LinksWidget />
      </div>
      <div className="w-1/2 px-3">
        <Feed />
      </div>
      <div className="w-1/4 pl-10 space-y-6">
        <MembersWidget />
        {isAdmin && <ChannelRequestWidget />}
        <AdminsWidget />
      </div>
    </div>
  );
};

export default Home;
