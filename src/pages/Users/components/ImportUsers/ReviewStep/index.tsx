/* eslint-disable @typescript-eslint/no-unused-vars */
import Button, { Size, Variant } from 'components/Button';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import React, { useEffect, useMemo, useState } from 'react';
import { StepEnum } from '../utils';
import 'react-data-grid/lib/styles.css';
import DataGrid, { RenderRowProps, Row } from 'react-data-grid';
import SwitchToggle from 'components/SwitchToggle';
import { useInfiniteImportData } from 'queries/importUsers';
import Spinner from 'components/Spinner';
import apiService from 'utils/apiService';
import useModal from 'hooks/useModal';
import Icon from 'components/Icon';
import Tooltip from 'components/Tooltip';
import ConfirmationBox from 'components/ConfirmationBox';
import { useQueryClient } from '@tanstack/react-query';
import WaitForParse from './WaitForParse';
import WaitForValidate from './WaitForValidate';
import { find } from 'lodash';

type AppProps = {
  open: boolean;
  closeModal: () => any;
  setStep: (...args: any) => any;
  importId: string;
  meta: any;
};

enum LoaderStep {
  Parse = 'parse',
  Validate = 'validate',
  Review = 'review',
}

const ReviewStep: React.FC<AppProps> = ({
  open,
  importId,
  closeModal,
  setStep,
  meta,
}) => {
  const queryClient = useQueryClient();
  const [loaderStep, setLoaderStep] = useState(LoaderStep.Parse);
  // const { ready, loading } = usePoller({ importId, action: 'validate' });
  const [showOnlyError, setShowOnlyError] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [errorConfirm, showConfirm, closeConfirm] = useModal();
  const [backConfirm, showBackConfirm, closeBackConfirm] = useModal();

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteImportData({
      importId,
      startFetching: loaderStep === LoaderStep.Review,
      q: { includeOnlyErrors: showOnlyError || undefined },
    });

  const _sheet = data?.pages?.[0]?.data?.result?.data?.sheets || {};

  const flatData: any[] = (
    data?.pages.flatMap((page) => {
      return page?.data?.result?.data?.info.map((user: any) => user);
    }) || []
  ).map((f, idx) => ({ idx: idx + 1, ...f }));

  const columns = [
    { key: 'idx', name: '', width: 40 },
    {
      key: 'name',
      name: 'Name',
      resizable: true,
      width: 200,
      renderCell: ({ row, tabIndex }: any) => {
        return row.rowData?.fullName?.value;
      },
      cellClass: (row: any) => {
        if (!row.rowData?.fullName?.value) {
          return 'text-red-500 bg-red-50';
        }
        return '';
      },
      headerCellClass:
        _sheet?.rowCount &&
        _sheet?.rowCount === _sheet?.columnMapping?.fullName?.errorRowsCount
          ? 'bg-red-50 text-red-500'
          : '',
    },
    {
      key: 'email',
      name: 'Email',
      resizable: true,
      width: 220,
      renderCell: ({ row, tabIndex }: any) => {
        return row.rowData.email?.value;
      },
      cellClass: (row: any) => {
        if (!row.rowData.email?.isValid) {
          return 'text-red-500 bg-red-50';
        }
        return '';
      },
      headerCellClass:
        _sheet?.rowCount &&
        _sheet?.rowCount === _sheet?.columnMapping?.email?.errorRowsCount
          ? 'bg-red-50 text-red-500'
          : '',
    },
    {
      key: 'managerEmail',
      name: 'Manager Email',
      resizable: true,
      width: 220,
      renderCell: ({ row, tabIndex }: any) => {
        return row.rowData.managerEmail?.value;
      },
      cellClass: (row: any) => {
        if (!row.rowData.managerEmail?.isValid) {
          return 'text-red-500 bg-red-50';
        }
        return '';
      },
      headerCellClass:
        _sheet?.rowCount &&
        _sheet?.rowCount === _sheet?.columnMapping?.managerEmail?.errorRowsCount
          ? 'bg-red-50 text-red-500'
          : '',
    },
    {
      key: 'designation',
      name: 'Designation',
      resizable: true,
      width: 180,
      renderCell: ({ row, tabIndex }: any) => {
        return row.rowData.designation?.value;
      },
      cellClass: (row: any) => {
        if (!row.rowData.designation?.isValid) {
          return 'text-red-500 bg-red-50';
        }
        return '';
      },
      headerCellClass:
        _sheet?.rowCount &&
        _sheet?.rowCount === _sheet?.columnMapping?.designation?.errorRowsCount
          ? 'bg-red-50 text-red-500'
          : '',
    },
    {
      key: 'department',
      name: 'Department',
      resizable: true,
      width: 220,
      renderCell: ({ row, tabIndex }: any) => {
        return row.rowData.department?.value;
      },
      cellClass: (row: any) => {
        if (!row.rowData.department?.isValid) {
          return 'text-red-500 bg-red-50';
        }
        return '';
      },
      headerCellClass:
        _sheet?.rowCount &&
        _sheet?.rowCount === _sheet?.columnMapping?.department?.errorRowsCount
          ? 'bg-red-50 text-red-500'
          : '',
    },
    {
      key: 'workLocation',
      name: 'Location',
      resizable: true,
      width: 220,
      renderCell: ({ row, tabIndex }: any) => {
        return row.rowData.workLocation?.value;
      },
      cellClass: (row: any) => {
        if (!row.rowData.workLocation?.isValid) {
          return 'text-red-500 bg-red-50';
        }
        return '';
      },
      headerCellClass:
        _sheet?.rowCount &&
        _sheet?.rowCount === _sheet?.columnMapping?.workLocation?.errorRowsCount
          ? 'bg-red-50 text-red-500'
          : '',
    },
    {
      key: 'employeeId',
      name: 'Employee ID',
      resizable: true,
      width: 120,
      renderCell: ({ row, tabIndex }: any) => {
        return row.rowData.employeeId?.value;
      },
      cellClass: (row: any) => {
        if (!row.rowData.employeeId?.isValid) {
          return 'text-red-500 bg-red-50';
        }
        return '';
      },
      headerCellClass:
        _sheet?.rowCount &&
        _sheet?.rowCount === _sheet?.columnMapping?.employeeId?.errorRowsCount
          ? 'bg-red-50 text-red-500'
          : '',
    },
    {
      key: 'workPhone',
      name: 'Phone',
      resizable: true,
      width: 120,
      renderCell: ({ row, tabIndex }: any) => {
        return row.rowData.workPhone?.value;
      },
      cellClass: (row: any) => {
        if (!row.rowData.workPhone?.isValid) {
          return 'text-red-500 bg-red-50';
        }
        return '';
      },
      headerCellClass:
        _sheet?.rowCount &&
        _sheet?.rowCount === _sheet?.columnMapping?.workPhone?.errorRowsCount
          ? 'bg-red-50 text-red-500'
          : '',
    },
    {
      key: 'birthDate',
      name: 'Date of Birth',
      resizable: true,
      width: 140,
      renderCell: ({ row, tabIndex }: any) => {
        return row.rowData.birthDate?.value;
      },
      cellClass: (row: any) => {
        if (!row.rowData.birthDate?.isValid) {
          return 'text-red-500 bg-red-50';
        }
        return '';
      },
      headerCellClass: flatData.some(
        (row: any) => !row.rowData.birthDate?.isValid,
      )
        ? 'bg-red-50 !overflow-visible'
        : '',
      renderHeaderCell: () => {
        if (flatData.some((row: any) => !row.rowData.birthDate?.isValid)) {
          return (
            <div className="w-full flex justify-between items-center text-red-500">
              <p>Date of Birth</p>
              <Tooltip
                tooltipContent="Date format is dd/mm/yyyy"
                tooltipPosition="bottom"
              >
                <Icon name="infoCircle" size={16} color="text-red-500" />
              </Tooltip>
            </div>
          );
        }
        return 'Date of Birth';
      },
    },
    {
      key: 'joinDate',
      name: 'Date of Joining',
      resizable: true,
      width: 140,
      renderCell: ({ row, tabIndex }: any) => {
        return row.rowData.joinDate?.value;
      },
      cellClass: (row: any) => {
        if (!row.rowData.joinDate?.isValid) {
          return 'text-red-500 bg-red-50';
        }
        return '';
      },
      headerCellClass: flatData.some(
        (row: any) => !row.rowData?.joinDate?.isValid,
      )
        ? 'bg-red-50 !overflow-visible'
        : '',
      renderHeaderCell: () => {
        if (flatData.some((row: any) => !row.rowData.joinDate?.isValid)) {
          return (
            <div className="w-full flex justify-between items-center text-red-500">
              <p>Date of Joining</p>
              <Tooltip
                tooltipContent="Date format is dd/mm/yyyy"
                tooltipPosition="bottom"
              >
                <Icon name="infoCircle" size={16} color="text-red-500" />
              </Tooltip>
            </div>
          );
        }
        return 'Date of Joining';
      },
    },
    {
      key: 'maritalStatus',
      name: 'Marital Status',
      resizable: true,
      width: 120,
      renderCell: ({ row, tabIndex }: any) => {
        return row.rowData.maritalStatus.value;
      },
      cellClass: (row: any) => {
        if (!row.rowData.maritalStatus?.isValid) {
          return 'text-red-500 bg-red-50';
        }
        return '';
      },
      headerCellClass:
        _sheet?.rowCount &&
        _sheet?.rowCount ===
          _sheet?.columnMapping?.maritalStatus?.errorRowsCount
          ? 'bg-red-50 text-red-500'
          : '',
    },
    {
      key: 'role',
      name: 'Role',
      resizable: true,
      width: 120,
      renderCell: ({ row, tabIndex }: any) => {
        return row.rowData.role.value;
      },
      cellClass: (row: any) => {
        if (!row.rowData.role?.isValid) {
          return 'text-red-500 bg-red-50';
        }
        return '';
      },
      headerCellClass:
        _sheet?.rowCount &&
        _sheet?.rowCount === _sheet?.columnMapping?.role?.errorRowsCount
          ? 'bg-red-50 text-red-500'
          : '',
    },
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

  const handleClick = async () => {
    setInProgress(true);
    const { data } = await apiService.get(
      `/users/import/${importId}/validate?includeOnlyErrors=true`,
    );
    if (data.result.totalCount) {
      setErrorCount(data.result.totalCount || 0);
      showConfirm();
    } else {
      setStep(StepEnum.Confirmation);
    }
    setInProgress(false);
  };

  return (
    <>
      <Modal open={open} className="max-w-[1350px]">
        <Header
          onBackIconClick={() => {
            setStep(StepEnum.Importing);
            queryClient.removeQueries(['csv-import']);
          }}
          title="Bulk Add User info"
          onClose={() => {
            closeModal();
            queryClient.removeQueries(['csv-import']);
          }}
          titleDataTestId="back-arrow"
          closeBtnDataTestId="import-people-close"
        />
        <div className="bg-purple-50 pt-4">
          <div className="bg-white rounded-7xl mb-4 mx-4 px-4 py-3 shadow-sm">
            <span className="text-primary-700 font-bold">Importing File </span>{' '}
            <span className="text-primary-700 font-bold text-lg">&gt;</span>{' '}
            <span className="text-primary-500 font-medium text-base">
              Review
            </span>
          </div>
          {(() => {
            if (loaderStep === LoaderStep.Parse) {
              return (
                <WaitForParse
                  importId={importId}
                  setNextStep={() => setLoaderStep(LoaderStep.Validate)}
                />
              );
            }
            if (loaderStep === LoaderStep.Validate) {
              return (
                <WaitForValidate
                  importId={importId}
                  setNextStep={() => setLoaderStep(LoaderStep.Review)}
                />
              );
            }
            if (isLoading) {
              return (
                <div className="p-12 flex justify-center items-center">
                  <Spinner />
                </div>
              );
            }

            return (
              <div className="bg-white">
                <div className="px-6">
                  <div className="py-4 text-sm text-neutral-900 v-center space-x-2">
                    <SwitchToggle
                      defaultValue={showOnlyError}
                      onChange={(c) => {
                        setShowOnlyError(c);
                      }}
                      dataTestId="show-problem-rows"
                    />
                    <span className="text-sm">Only show rows with problem</span>
                  </div>

                  {flatData?.length ? (
                    <DataGrid
                      enableVirtualization
                      columns={columns}
                      rows={flatData}
                      rowKeyGetter={rowKeyGetter}
                      rowHeight={26}
                      headerRowHeight={28}
                      className="text-xs rdg-light h-[65vh] w-auto"
                      onScroll={handleScroll}
                      data-testid="value-row"
                    />
                  ) : (
                    <div className="flex flex-col justify-center items-center p-4">
                      <img src={require('../nodata.png')} />
                      <div
                        className="pt-4 text-2xl font-bold"
                        data-testid="no-data-msg"
                      >
                        No data to display
                      </div>
                    </div>
                  )}
                  {isFetchingNextPage && (
                    <div className="text-xs font-bold text-neutral-500 text-center">
                      Loading...
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
        <div className="flex justify-between items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
          <Button
            label="Go Back"
            variant={Variant.Secondary}
            size={Size.Small}
            className="mr-4"
            onClick={showBackConfirm}
            dataTestId="go-back-cta"
          />
          <div className="v-center">
            <Button
              label="Cancel"
              variant={Variant.Secondary}
              size={Size.Small}
              className="mr-4"
              onClick={closeModal}
              dataTestId="cancel-review-cta"
            />
            <Button
              label="Review"
              size={Size.Small}
              dataTestId="review-cta"
              onClick={handleClick}
              loading={inProgress}
              disabled={
                isLoading ||
                loaderStep !== LoaderStep.Review ||
                !flatData?.length
              }
            />
          </div>
        </div>
        {errorConfirm && (
          <Modal open={errorConfirm}>
            <Header
              title="Unresolved errors"
              onClose={closeConfirm}
              closeBtnDataTestId="import-people-close"
            />
            <div className="flex flex-col justify-center items-center p-4">
              <Icon name="warningCircle" className="text-red-500" size={80} />
              <div
                className="text-lg font-bold text-neutral-700 pt-4"
                data-testid="issue-count"
              >
                You have {errorCount} rows with unresolved issue
              </div>
              <div className="text-center mt-4 px-6">
                We will ignore the entire row if you wish to proceed or you can
                modify your file
              </div>
            </div>
            <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
              <Button
                label="Go back"
                variant={Variant.Secondary}
                size={Size.Small}
                className="mr-4"
                onClick={closeConfirm}
                dataTestId="goback-cta"
              />
              <Button
                label="Proceed"
                size={Size.Small}
                dataTestId="proceed-cta"
                onClick={() => setStep(StepEnum.Confirmation)}
                loading={inProgress}
              />
            </div>
          </Modal>
        )}
      </Modal>
      {backConfirm && (
        <ConfirmationBox
          open={backConfirm}
          onClose={() => {
            queryClient.removeQueries(['csv-import']);
            closeConfirm();
          }}
          title="Confirmation"
          description={
            <span>
              Are you sure you want to clear all changes to data in progress in
              this state?
            </span>
          }
          success={{
            label: 'Yes',
            className: '',
            onSubmit: () => setStep(StepEnum.Importing),
          }}
          discard={{
            label: 'Cancel',
            className: '',
            onCancel: closeBackConfirm,
          }}
        />
      )}
    </>
  );
};

export default ReviewStep;
