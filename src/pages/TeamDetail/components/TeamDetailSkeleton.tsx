import Skeleton from 'react-loading-skeleton';

const TeamDetailSkeleton = () => {
  return (
    <>
      <div className="flex justify-between items-center px-8 h-[40px]">
        <Skeleton
          className="!h-[32px] !w-[100px] rounded-9xl leading-none"
          borderRadius={10}
        />
        <Skeleton
          className="!h-[40px] !w-[150px] rounded-full leading-none"
          borderRadius={40}
        />
      </div>
      <Skeleton className="h-[97.78px] leading-none mt-6" />
    </>
  );
};

export default TeamDetailSkeleton;
