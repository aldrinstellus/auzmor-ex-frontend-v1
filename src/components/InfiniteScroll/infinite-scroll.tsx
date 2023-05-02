import React, { LegacyRef, ReactNode } from 'react';
import useVirtual, { MeasureRef, OnScroll } from 'react-cool-virtual';

export type InfiniteScrollProps = {
  /**
   * Length of array
   */
  itemCount: number;

  /**
   * It should be true when first time loading is happening. It should not be true for upcomming data fetching
   */
  isLoading?: boolean;

  /**
   * A component when isLoading is true
   */
  loadingComponent?: ReactNode;

  /**
   * It should be true when api call is going on for load more data
   */
  isFetchingNextPage?: boolean;

  /**
   * Classes for outer div
   */
  outerClassName?: string;

  /**
   * Classes for inner div
   */
  innerClassName?: string;

  /**
   * A function that renders the item component
   */
  itemRenderer: (index: number, measureRef: MeasureRef) => ReactNode;

  /**
   * A function that will be called to load next set of data
   */
  loadMore: () => void;

  /**
   * Callback on scroll
   */
  onScroll?: OnScroll;
};

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  itemCount,
  isLoading,
  loadingComponent,
  isFetchingNextPage = false,
  outerClassName,
  innerClassName,
  itemRenderer,
  loadMore = () => {},
  onScroll = () => {},
}) => {
  const { outerRef, innerRef, items } = useVirtual({
    itemCount,
    onScroll: (event) => {
      console.log('on scrollll');
      if (event.visibleStopIndex === event.overscanStopIndex) {
        console.log('hey!');
        loadMore();
      }
      onScroll(event);
    },
  });

  return (
    <div ref={outerRef as LegacyRef<HTMLDivElement>} className={outerClassName}>
      <div
        ref={innerRef as LegacyRef<HTMLDivElement>}
        className={innerClassName}
      >
        {isLoading
          ? loadingComponent || <div>Loading...</div>
          : items.map(({ index, measureRef }) => {
              return itemRenderer(index, measureRef);
            })}
      </div>
    </div>
  );
};
