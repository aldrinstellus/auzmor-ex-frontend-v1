/* eslint-disable @typescript-eslint/no-unused-vars */
import Button, { Size, Variant } from 'components/Button';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import React, { useEffect, useMemo, useState } from 'react';
import { StepEnum } from './utils';
import { useInfiniteUsers } from 'queries/users';
import { useInView } from 'react-intersection-observer';
import 'react-data-grid/lib/styles.css';
import DataGrid, { RenderRowProps, Row } from 'react-data-grid';
import SwitchToggle from 'components/SwitchToggle';

type AppProps = {
  open: boolean;
  closeModal: () => any;
  setStep: (...args: any) => any;
};

const ReviewStep: React.FC<AppProps> = ({ open, closeModal, setStep }) => {
  const [showOnlyError, setShowOnlyError] = useState(false);
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteUsers({});

  const flatData: any[] = (
    data?.pages.flatMap((page) => {
      return page?.data?.result?.data.map((user: any) => ({
        ...user,
        department: user?.department?.name,
        location: user?.workLocation?.name,
      }));
    }) || []
  ).map((f, idx) => ({ idx: idx + 1, ...f }));

  const columns = [
    { key: 'idx', name: '', width: 40 },
    {
      key: 'firstName',
      name: 'First Name',
      cellClass: (row: any) => {
        if (row.fullName?.includes('ah')) {
          return 'text-red-500 bg-red-50';
        }
        return '';
      },
    },
    { key: 'lastName', name: 'Last Name' },
    { key: 'primaryEmail', name: 'Personal Email' },
    { key: 'role', name: 'Job title' },
    { key: 'createdAt', name: 'Start Date' },
    { key: 'department', name: 'Department' },
    { key: 'location', name: 'Location' },
  ];

  const rowKeyGetter = (row: any) => row.id;

  const handleScroll = (event: any) => {
    if (hasNextPage && !isFetchingNextPage) {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget || {
        scrollTop: 0,
        scrollHeight: 0,
        clientHeight: 0,
      };
      if (scrollHeight - (scrollTop + clientHeight) < 1000) {
        fetchNextPage();
      }
    }
  };

  return (
    <Modal open={open} className="max-w-[1350px]">
      <Header
        onBackIconClick={() => null}
        title="Bulk Add User info"
        onClose={closeModal}
        closeBtnDataTestId="import-people-close"
      />
      <div className="bg-purple-50 pt-4">
        <div className="bg-white rounded-7xl mb-4 mx-4 px-4 py-3 shadow-sm">
          <span className="text-primary-700 font-bold">Importing File </span>{' '}
          <span className="text-primary-700 font-bold text-lg">&gt;</span>{' '}
          <span className="text-primary-500">Review</span>
        </div>
        {isLoading ? (
          <div>Loader...</div>
        ) : (
          <div className="bg-white">
            <div className="px-6">
              <div className="py-4 text-sm text-neutral-900 v-center space-x-2">
                <SwitchToggle
                  className="!h-5 !w-10"
                  defaultValue={showOnlyError}
                  onChange={(c) => {
                    setShowOnlyError(c);
                  }}
                />
                <span className="text-sm">Only show rows with problem</span>
              </div>

              <DataGrid
                enableVirtualization
                columns={columns}
                rows={flatData}
                rowKeyGetter={rowKeyGetter}
                rowHeight={32}
                headerRowHeight={36}
                className="text-xs rdg-light h-[65vh]"
                onScroll={handleScroll}
              />
              {isFetchingNextPage && (
                <div className="text-xs font-bold text-neutral-500 text-center">
                  Loading...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
        <Button
          label="Go Back"
          variant={Variant.Secondary}
          size={Size.Small}
          className="mr-4"
          onClick={() => setStep(StepEnum.SelectSheet)}
          dataTestId="mport-people-cancel"
        />
        <div className="v-center">
          <Button
            label="Cancel"
            variant={Variant.Secondary}
            size={Size.Small}
            className="mr-4"
            onClick={closeModal}
            dataTestId="mport-people-cancel"
          />
          <Button
            label="Confirm"
            size={Size.Small}
            dataTestId="mport-people-next"
            onClick={() => setStep(StepEnum.Confirmation)}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ReviewStep;
