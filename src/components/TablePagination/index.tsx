import React, { useMemo } from 'react';
import clsx from 'clsx';
import ReactPaginate from 'react-paginate';
import Icon from 'components/Icon';

export type TablePaginationProps = {
  page?: number;
  onPageChange: (value: React.SetStateAction<any>) => void;
  total: number;
  limit?: number;
  className?: string;
  dataTestIdPrefix?: string;
};

const TablePagination: React.FC<TablePaginationProps> = ({
  page = 1,
  onPageChange,
  total,
  limit = 30,
  className = '',
  dataTestIdPrefix = '',
}) => {
  const containerStyles = useMemo(
    () =>
      clsx(
        { 'flex space-x-1 cursor-pointer': true },
        {
          [className]: true,
        },
      ),

    [className],
  );

  const linkStyles = clsx({
    'border-neutral-200 rounded-7xl border-2 px-3 py-0 h-8 mx-1 my-auto flex box-border items-center text-sm':
      true,
  });

  const activeLinkStyles = clsx({
    'bg-neutral-900 rounded-7xl text-white': true,
  });

  const pageCount = Math.ceil(total / limit);

  const hasNext = page < pageCount;

  const hasPrev = page > 1;

  const nextStyle = clsx(
    { 'w-8 h-8 rounded-7xl center border': true },
    { '': hasNext },
  );

  const prevStyle = clsx(
    { 'w-8 h-8 rounded-7xl center border': true },
    { '': hasPrev },
  );

  return (
    <ReactPaginate
      className=""
      breakLabel="..."
      nextLabel={
        <div className={nextStyle} data-testid={`${dataTestIdPrefix}-next`}>
          <Icon name="arrowRightOutline" size={16} />
        </div>
      }
      onPageChange={(params) => {
        onPageChange(params.selected + 1);
      }}
      pageRangeDisplayed={3}
      pageCount={pageCount}
      previousLabel={
        <div className={prevStyle} data-testid={`${dataTestIdPrefix}-previous`}>
          <Icon name="arrowLeftOutline" size={16} />
        </div>
      }
      renderOnZeroPageCount={null}
      containerClassName={containerStyles}
      pageLinkClassName={linkStyles}
      activeLinkClassName={activeLinkStyles}
    />
  );
};

export default TablePagination;
