import React, { LegacyRef, ReactNode } from 'react';
import useVirtual, { MeasureRef, OnScroll } from 'react-cool-virtual';

export type InfiniteScrollProps = {
  itemCount: number;
  isLoading?: boolean;
  loadingComponent?: ReactNode;
  isFetchingNextPage?: boolean;
  outerClassName?: string;
  innerClassName?: string;
  prependElement?: ReactNode;
  itemRenderer: (index: number, measureRef: MeasureRef) => ReactNode;
  loadMore: () => void;
  onScroll?: OnScroll;
};

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  itemCount,
  isLoading,
  loadingComponent,
  isFetchingNextPage = false,
  outerClassName,
  innerClassName,
  prependElement: prependElement,
  itemRenderer,
  loadMore = () => {},
  onScroll = () => {},
}) => {
  const { outerRef, innerRef, items } = useVirtual({
    itemCount,
    onScroll: (event) => {
      if (
        event.visibleStopIndex === event.overscanStopIndex &&
        !isFetchingNextPage
      ) {
        loadMore();
      }
      onScroll(event);
    },
  });

  return (
    <div ref={outerRef as LegacyRef<HTMLDivElement>} className={outerClassName}>
      <div></div>
      <div
        ref={innerRef as LegacyRef<HTMLDivElement>}
        className={innerClassName}
      >
        {prependElement}
        {isLoading
          ? loadingComponent || <div>Loading...</div>
          : items.map(({ index, measureRef }) => {
              return itemRenderer(index, measureRef);
            })}
      </div>
      <div></div>
    </div>
  );
};
