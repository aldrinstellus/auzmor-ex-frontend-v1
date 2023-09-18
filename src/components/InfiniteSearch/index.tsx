import clsx from 'clsx';
import Button, { Variant, Size } from 'components/Button';
import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import PopupMenu from 'components/PopupMenu';
import Spinner from 'components/Spinner';
import React, { useCallback, useEffect, ReactNode, useMemo } from 'react';
import { Control } from 'react-hook-form';
import { useInView } from 'react-intersection-observer';

interface IOption {
  label: string;
  value: any;
  id: string;
}

interface IInfiniteSearchProps {
  title: string;
  control: Control<any>;
  options: IOption[];
  searchName: string;
  optionsName: string;
  onReset?: () => void;
  onApply?: () => void;
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: any;
  hasNextPage?: boolean;
  selectionCount?: number;
  itemRenderer?: (item: IOption) => ReactNode;
  disabled?: boolean;
  dataTestId?: string;
}

const InfiniteSearch: React.FC<IInfiniteSearchProps> = ({
  title,
  options,
  control,
  searchName,
  optionsName,
  onReset = () => {},
  onApply = () => {},
  isLoading,
  isFetchingNextPage,
  fetchNextPage,
  hasNextPage,
  selectionCount = 0,
  itemRenderer,
  disabled = false,
  dataTestId,
}) => {
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const checkboxField = useCallback(
    (option: IOption) => {
      return [
        {
          type: FieldType.Checkbox,
          name: `${optionsName}.${option.id}`,
          control,
          className: 'flex item-center mr-[10px]',
          inputClassName: '!h-4 !w-4',
        },
      ];
    },
    [options],
  );

  const searchField = [
    {
      type: FieldType.Input,
      control,
      name: searchName,
      placeholder: 'Search',
      isClearable: true,
      leftIcon: 'search',
      inputClassName: 'text-sm py-[7px]',
      dataTestId: `${dataTestId}-search`,
    },
  ];

  const triggeredNodeStyle = useMemo(
    () =>
      clsx({
        'flex items-center ml-2 px-3 py-[3px] border border-neutral-200 rounded-17xl ':
          true,
        'border-none bg-primary-50 text-primary-500': !!selectionCount,
        'cursor-pointer': !disabled,
        'pointer-events-none opacity-50': disabled,
      }),
    [selectionCount, disabled],
  );

  return (
    <PopupMenu
      triggerNode={
        <div className={triggeredNodeStyle} data-testid={dataTestId}>
          <div className="mr-1">{title}</div>
          {selectionCount > 0 && (
            <div
              className="flex items-center justify-center rounded-full text-xs bg-red-500 text-white w-4 h-4 mx-1"
              data-testid={`${dataTestId}-count`}
            >
              {selectionCount}
            </div>
          )}
          <Icon
            name="arrowDown"
            size={16}
            color={selectionCount ? 'text-primary-500' : undefined}
          />
        </div>
      }
      menuItems={[
        {
          renderNode: (
            <div className="flex flex-col">
              <div onClick={(e) => e.preventDefault()}>
                <Layout fields={searchField} className="mx-3 mt-3" />
              </div>
              {isLoading ? (
                <div className="w-full flex items-center justify-center p-10">
                  <Spinner />
                </div>
              ) : (
                <div className="max-h-[128px] my-2 overflow-y-scroll">
                  {options.map((option: IOption) =>
                    itemRenderer ? (
                      itemRenderer(option)
                    ) : (
                      <div
                        className="px-6 py-2 text-xs flex items-center"
                        key={option.id}
                        onClick={(e) => e.stopPropagation()}
                        data-testid={`${dataTestId}-${option.label}`}
                      >
                        <Layout fields={checkboxField(option)} />
                        <div>{option.label}</div>
                      </div>
                    ),
                  )}
                  {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
                </div>
              )}
              <div className="px-3 py-2 flex justify-end bg-blue-50">
                <Button
                  label={'Reset'}
                  variant={Variant.Secondary}
                  className="mr-2"
                  size={Size.Small}
                  onClick={onReset}
                  dataTestId={`${dataTestId}-reset`}
                />
                <Button
                  label={'Apply'}
                  size={Size.Small}
                  onClick={onApply}
                  dataTestId={`${dataTestId}-apply`}
                />
              </div>
            </div>
          ),
        },
      ]}
      className="top-full -left-[50%] mt-2 border border-neutral-200 min-w-[256px]"
      disabled={disabled}
    />
  );
};

export default InfiniteSearch;
