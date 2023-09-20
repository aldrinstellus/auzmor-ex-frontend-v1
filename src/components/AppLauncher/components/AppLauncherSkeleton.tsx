import Card from 'components/Card';
import Skeleton from 'react-loading-skeleton';

const AppLauncherSkeleton = () => {
  return (
    <Card className="py-6 flex flex-col rounded-9xl">
      <div className="px-6 flex flex-col gap-4">
        <Skeleton className="h-6" borderRadius={10} />
        <div className="flex items-center gap-8">
          {[...Array(3)].map((element) => (
            <div className="flex flex-col gap-2" key={element}>
              <Skeleton className="!h-[60px] !w-[60px]" borderRadius={60} />
              <Skeleton className="h-[18px]" borderRadius={10} />
            </div>
          ))}
        </div>
        <Skeleton className="h-9" borderRadius={32} />
      </div>
    </Card>
  );
};

export default AppLauncherSkeleton;
