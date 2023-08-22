import Button, { Variant, Size } from 'components/Button';
import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import PopupMenu from 'components/PopupMenu';
import Spinner from 'components/Spinner';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Control } from 'react-hook-form';
import { useInView } from 'react-intersection-observer';
import { PRIMARY_COLOR } from 'utils/constants';

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
}) => {
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <PopupMenu
      triggerNode={
        <div
          className={`flex items-center ml-2 px-3 py-1 border border-neutral-200 rounded-17xl ${
            selectionCount && 'border-none bg-primary-50 text-primary-500'
          }`}
        >
          <div className="mr-1">{title}</div>
          {selectionCount > 0 && (
            <div className="flex items-center justify-center rounded-full bg-red-500 text-white w-6 h-6 mx-1">
              {selectionCount}
            </div>
          )}
          <Icon
            name="arrowDown"
            size={16}
            stroke={selectionCount ? PRIMARY_COLOR : undefined}
          />
        </div>
      }
      menuItems={[
        {
          renderNode: (
            <div className="flex flex-col">
              <div onClick={(e) => e.preventDefault()}>
                <Layout
                  fields={[
                    {
                      type: FieldType.Input,
                      control,
                      name: searchName,
                      placeholder: 'Search',
                      isClearable: true,
                      leftIcon: 'search',
                    },
                  ]}
                  className="mx-3 mt-3 mb-2"
                />
              </div>
              {isLoading ? (
                <div className="w-full flex items-center justify-center p-10">
                  <Spinner />
                </div>
              ) : (
                <div className="max-h-[128px] overflow-y-scroll">
                  {options.map((option: IOption, index) => (
                    <div
                      className="px-6 py-2 flex items-center"
                      key={index}
                      onClick={(e) => e.preventDefault()}
                    >
                      <Layout
                        fields={[
                          {
                            type: FieldType.Checkbox,
                            name: `${optionsName}.${option.id}`,
                            control,
                            className: 'flex item-center mr-4',
                          },
                        ]}
                      />
                      <div>{option.label}</div>
                    </div>
                  ))}
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
                />
                <Button label={'Apply'} size={Size.Small} onClick={onApply} />
              </div>
            </div>
          ),
        },
      ]}
      className="top-full -left-[50%] mt-2 border border-neutral-200 min-w-[256px]"
    />
  );
};

export default InfiniteSearch;
