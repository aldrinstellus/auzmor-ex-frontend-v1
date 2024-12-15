import React from 'react';

interface ImageRowProps {
  loaderPadding?: string;
  bgColor?: string;
  loaderCount?: number;
}

const ImageLoader: React.FC = () => (
  <div className="animate-pulse w-full">
    <div className="flex items-center">
      <div className="h-[42px] w-[50px] bg-gray-300 rounded-lg mr-4 flex-shrink-0"></div>
      <div className="flex flex-col flex-grow">
        <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

const NotificationSkeleton: React.FC<ImageRowProps> = ({
  loaderPadding = 'p-4',
  bgColor = 'bg-white',
  loaderCount = 3,
}) => (
  <div className={`${bgColor} ${loaderPadding} w-full`}>
    <div className="space-y-6 w-full">
      {Array.from({ length: loaderCount }).map((_, index) => (
        <ImageLoader key={index} />
      ))}
    </div>
  </div>
);

export default NotificationSkeleton;
