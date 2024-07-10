import { ChangeEvent, FC, ReactNode, useCallback, useEffect } from 'react';
import Spinner from 'components/Spinner';
import Layout, { FieldType } from 'components/Form';
import { useForm, UseFormReset } from 'react-hook-form';
import NoDataFound from 'components/NoDataFound';
import { useInView } from 'react-intersection-observer';
import clsx from 'clsx';
import Divider from 'components/Divider';
import Button, { Variant } from 'components/Button';
interface IUseForm {
  selectAll: boolean;
  showSelected: boolean;
  entity: Record<string, any>;
}

interface IMenuItem {
  key: string;
  component: (
    selectedEntities: any,
    reset: UseFormReset<IUseForm>,
  ) => ReactNode;
}

interface IEntitySelectorProps {
  entityData: Array<Record<string, any>>;
  entityRenderer: (entity: Record<string, any>) => ReactNode;
  entityHeaderRenderer: () => ReactNode;
  dataTestId?: string;
  isLoading?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  rowClassName?: string;
  fetchNextPage?: () => any;
  menuItems?: IMenuItem[];
}
const EntitySelector: FC<IEntitySelectorProps> = ({
  entityData = [],
  dataTestId,
  isLoading,
  hasNextPage = false,
  isFetchingNextPage = false,
  rowClassName = '',
  entityRenderer,
  entityHeaderRenderer,
  fetchNextPage = () => {},
  menuItems = [],
}) => {
  const { control, watch, setValue, reset } = useForm<IUseForm>({
    defaultValues: {
      selectAll: false,
      showSelected: false,
      entity: {},
    },
  });

  const entities = watch('entity');

  const selectedEntities = Object.keys(entities).reduce((filtered, key) => {
    if (entities[key]) {
      (filtered as Record<string, any>[]).push(entities[key]);
    }
    return filtered;
  }, []);

  const { ref, inView } = useInView({
    root: document.getElementById('entity-select-body'),
    rootMargin: '20%',
  });
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const getRowStyle = useCallback(
    (isSelected?: boolean) =>
      clsx({
        'flex flex-col items-center p-1 my-3 hover:bg-primary-50': true,
        'bg-primary-50': isSelected,
        [rowClassName]: true,
      }),
    [rowClassName],
  );

  const selectAll = () => {
    entityData.forEach((entity) => setValue(`entity.${entity.id}`, entity));
  };

  const deselectAll = () => {
    entityData.forEach((entity) => setValue(`entity.${entity.id}`, false));
  };

  const updateSelectAll = () => {
    if (
      entityData?.length === 0 ||
      entityData?.some((entity) => !entities?.[entity.id])
    ) {
      setValue('selectAll', false);
    } else {
      setValue('selectAll', true);
    }
  };

  return (
    <div>
      {!!selectedEntities.length && (
        <ul className="flex gap-10">
          <li>
            <Button
              leftIcon="close"
              leftIconSize={16}
              leftIconClassName="!text-neutral-900 group-hover:!text-primary-700"
              label={`${selectedEntities.length} selected`}
              variant={Variant.Tertiary}
              labelClassName="ml-2 text-primary-500"
              onClick={() => {
                setValue('selectAll', false);
                deselectAll();
              }}
              className="pl-1"
            />
          </li>
          {menuItems.map((item) => (
            <li key={item.key}>{item.component(selectedEntities, reset)}</li>
          ))}
        </ul>
      )}
      {/* Header */}
      {!!entityData?.length && (
        <div className={getRowStyle()}>
          <Layout
            fields={[
              {
                type: FieldType.Checkbox,
                name: `selectAll`,
                control,
                className: 'item-center gap-2 !justify-start w-full',
                dataTestId: `${dataTestId}-select-all`,
                label: entityHeaderRenderer(),
                labelContainerClassName: 'w-full',
                transform: {
                  input: (value: any) => {
                    return !!value;
                  },
                  output: (e: ChangeEvent<HTMLInputElement>) => {
                    if (e.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                    return e.target.checked;
                  },
                },
              },
            ]}
            className="w-full"
          />
        </div>
      )}
      {/* Body */}
      <ul
        className="flex flex-col max-h-72 overflow-scroll"
        id="entity-select-body"
        data-testid={`${dataTestId}-list`}
      >
        {isLoading ? (
          <div className="flex items-center w-full justify-center p-12">
            <Spinner />
          </div>
        ) : entityData?.length ? (
          entityData?.map((entity: Record<string, any>, index: number) => (
            <>
              <li key={entity.id} className={getRowStyle(entities[entity.id])}>
                <Layout
                  fields={[
                    {
                      type: FieldType.Checkbox,
                      name: `entity.${entity.id}`,
                      control,
                      className: 'item-center gap-2 !justify-start w-full',
                      inputClassName: `invisible hover:visible w-4 h-4 ${
                        entities[entity.id] ? '!visible' : ''
                      }`,
                      transform: {
                        input: (value: any) => {
                          updateSelectAll();
                          return !!value;
                        },
                        output: (e: ChangeEvent<HTMLInputElement>) => {
                          if (e.target.checked) return entity;
                          return false;
                        },
                      },
                      dataTestId: `${dataTestId}-select-${entity.id}`,
                      label: entityRenderer(entity),
                      labelContainerClassName: 'w-full',
                    },
                  ]}
                  className="w-full"
                />
              </li>
              {entityData.length - 1 > index && <Divider />}
            </>
          ))
        ) : (
          <NoDataFound
            className="py-4 w-full"
            message={<p>No data found.</p>}
            hideClearBtn
            dataTestId={`${dataTestId}-noresult`}
          />
        )}
        {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
        {isFetchingNextPage && (
          <div className="flex items-center w-full justify-center p-12">
            <Spinner />
          </div>
        )}
      </ul>
    </div>
  );
};
export default EntitySelector;
