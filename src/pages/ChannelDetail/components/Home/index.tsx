import LinksWidget from 'components/LinksWidget';
import Feed from './Feed';

const Home = () => {
  return (
    <div className="mb-32 flex w-full">
      <div className="w-1/4 pr-10 space-y-6">
        <div>
          <LinksWidget />
        </div>
      </div>
      <div className="w-1/2 px-3">
        <Feed />
      </div>
      <div className="w-1/4 pl-12">
        <div>Widgets</div>
      </div>
    </div>
  );
};

export default Home;
