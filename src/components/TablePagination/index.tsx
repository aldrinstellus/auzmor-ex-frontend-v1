import React, { useMemo } from 'react';
import clsx from 'clsx';
import ReactPaginate from 'react-paginate';

export type TablePaginationProps = {
  onPageChange: (value: React.SetStateAction<any>) => void;
  total: number;
  limit?: number;
  className?: string;
};

const TablePagination: React.FC<TablePaginationProps> = ({
  onPageChange,
  total,
  limit = 10,
  className = '',
}) => {
  const containerStyles = useMemo(
    () =>
      clsx(
        { 'flex list-none cursor-pointer float-right': true },
        {
          [className]: true,
        },
      ),

    [className],
  );

  const linkStyles = clsx({
    'border-neutral-100 rounded-[8px] border-2 px-3 py-0 h-8 mx-1 my-auto flex box-border items-center text-sm':
      true,
  });

  const activeLinkStyles = clsx({
    'bg-neutral-900 rounded-[8px] text-white': true,
  });

  const pageCount = Math.ceil(total / limit);

  return (
    <>
      <ReactPaginate
        breakLabel="..."
        nextLabel=" >"
        onPageChange={onPageChange}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="< "
        renderOnZeroPageCount={null}
        containerClassName={containerStyles}
        pageLinkClassName={linkStyles}
        previousLinkClassName={linkStyles}
        nextLinkClassName={linkStyles}
        activeLinkClassName={activeLinkStyles}
      />
    </>
  );
};

export default TablePagination;
