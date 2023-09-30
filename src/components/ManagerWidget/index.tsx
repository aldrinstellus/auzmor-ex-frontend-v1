import { useMutation, useQueryClient } from '@tanstack/react-query';
import Avatar from 'components/Avatar';
import Button, { Size, Variant, Type as ButtonType } from 'components/Button';
import Card from 'components/Card';
import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import IconWrapper, { Type } from 'components/Icon/components/IconWrapper';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import useHover from 'hooks/useHover';
import { isEmpty } from 'lodash';
import {
  updateCurrentUser,
  updateUserById,
  useInfiniteUsers,
} from 'queries/users';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { getFullName, getProfileImage } from 'utils/misc';

type AppProps = {
  data: Record<string, any>;
  canEdit: boolean;
};

interface IForm {
  manager: string;
}

const ManagerWidget: React.FC<AppProps> = ({ data, canEdit }) => {
  const [isHovered, eventHandlers] = useHover();
  const [isEditable, setIsEditable] = useState(false);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();
  const { userId = '' } = useParams();
  const {
    data: users,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteUsers({
    q: { q: search },
    startFetching: true,
  });

  const updateMutation = useMutation({
    mutationFn: userId
      ? (data: any) => updateUserById(userId, data)
      : updateCurrentUser,
    mutationKey: ['update-user-employeeId-mutation'],
    onError: (_error: any) => {},
    onSuccess: async (_response: any) => {
      successToastConfig('Manager updated');
      if (userId) {
        await queryClient.invalidateQueries(['user', userId]);
      } else {
        await queryClient.invalidateQueries(['current-user-me']);
      }
    },
  });

  const { handleSubmit, control, reset } = useForm<IForm>({
    mode: 'onSubmit',
    defaultValues: {
      manager: data?.manager?.id,
    },
  });

  const onSubmit = async (data: any) => {
    await updateMutation.mutateAsync({ manager: data?.manager?.value || null });
    await queryClient.invalidateQueries(['current-user-me']);
    setIsEditable(false);
  };

  const usersData = users?.pages.flatMap((page) => {
    return page?.data?.result?.data.map((user: any) => {
      try {
        return user;
      } catch (e) {
        console.log('Error', { user });
      }
    });
  });

  const fields = [
    {
      type: FieldType.AsyncSingleSelect,
      control,
      name: 'manager',
      label: 'Select Manager',
      className: '',
      selectClassName: 'org-select',
      placeholder: 'Select Manager',
      suffixIcon: <></>,
      clearIcon: (
        <Icon name="closeCircle" size={16} className="-mt-0.5 !mr-4" />
      ),
      isClearable: true,
      isLoading: isFetching,
      options: usersData?.map((member: any) => ({
        value: member.id,
        label: member.fullName,
        disabled: false,
        dataTestId: member.id,
        rowData: member,
      })),
      isFetchingNextPage,
      fetchNextPage,
      hasNextPage,
      onSearch: (q: string) => setSearch(q),
      dataTestId: 'manager-search',
    },
  ];

  return (
    <div>
      <div {...eventHandlers}>
        <Card shadowOnHover={canEdit}>
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="flex items-center justify-between">
              <p
                className="text-neutral-900 font-bold text-base"
                data-testid="manager-details"
              >
                Manager
              </p>
              {canEdit && isHovered && !isEditable ? (
                <IconWrapper
                  type={Type.Square}
                  className="cursor-pointer h-[24px] w-[24px]["
                  dataTestId={`manager-edit`}
                >
                  <Icon
                    name="edit"
                    size={16}
                    onClick={() => setIsEditable(!isEditable)}
                  />
                </IconWrapper>
              ) : (
                isEditable && (
                  <div className="flex space-x-3">
                    <Button
                      variant={Variant.Secondary}
                      label={'Cancel'}
                      size={Size.Small}
                      onClick={() => {
                        setIsEditable(false);
                        reset();
                      }}
                      dataTestId={`contact-info-cancel`}
                    />
                    <Button
                      label={'Save'}
                      size={Size.Small}
                      type={ButtonType.Submit}
                      dataTestId={`contact-info-save`}
                      loading={updateMutation.isLoading}
                    />
                  </div>
                )
              )}
            </div>
            <div className="mt-4">
              {isEditable ? (
                <div>
                  <Layout fields={fields} />
                </div>
              ) : isEmpty(data?.manager) ? (
                <div className="text-sm text-neutral-500">
                  No manager assigned
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Avatar
                    name={getFullName(data?.manager) || data?.manager?.email}
                    image={getProfileImage(data?.manager)}
                    size={32}
                    className="min-w-[48px]"
                  />
                  <div>
                    <div className="text-sm text-neutral-900 font-bold">
                      {data?.manager?.fullName}
                    </div>
                    <div className="text-neutral-500 text-xs">
                      {data?.manager?.designation?.name ||
                        'field not specified'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ManagerWidget;
