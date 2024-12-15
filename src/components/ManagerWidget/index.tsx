import { useMutation, useQueryClient } from '@tanstack/react-query';
import Avatar from 'components/Avatar';
import Button, { Size, Variant, Type as ButtonType } from 'components/Button';
import Card from 'components/Card';
import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import IconWrapper, { Type } from 'components/Icon/components/IconWrapper';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import useHover from 'hooks/useHover';
import { isEmpty, omitBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import {
  getFullName,
  getProfileImage,
  getUserCardTooltipProps,
} from 'utils/misc';
import Tooltip, { Variant as TooltipVariant } from 'components/Tooltip';
import UserCard from 'components/UserCard';
import { useTranslation } from 'react-i18next';
import useNavigate from 'hooks/useNavigation';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';

type AppProps = {
  data: Record<string, any>;
  canEdit: boolean;
};

interface IForm {
  manager: any;
}

const ManagerWidget: React.FC<AppProps> = ({ data, canEdit }) => {
  const [isHovered, eventHandlers] = useHover();
  const [isEditable, setIsEditable] = useState(false);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();
  const { userId = '' } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('profile');
  const { getApi } = usePermissions();
  const useInfiniteUsers = getApi(ApiEnum.GetUsers);
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

  const updateCurrentUser = getApi(ApiEnum.UpdateMe);
  const updateUserById = getApi(ApiEnum.UpdateUser);
  const updateMutation = useMutation({
    mutationFn: userId
      ? (data: any) => updateUserById(userId, data)
      : (data: Record<string, any>) => updateCurrentUser(data),
    mutationKey: ['update-user-employeeId-mutation'],
    onError: (_error: any) => {},
    onSuccess: async (_response: any) => {
      successToastConfig({ content: t('managerWidget.successToast') });
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
      manager: data?.manager?.userId
        ? { value: data?.manager?.userId, label: data?.manager?.fullName }
        : '',
    },
  });

  useEffect(() => {
    reset({
      manager: { value: data?.manager?.userId, label: data?.manager?.fullName },
    });
  }, [data]);

  const onSubmit = async (data: any) => {
    await updateMutation.mutateAsync({ manager: data?.manager?.value || null });
    await queryClient.invalidateQueries(['current-user-me']);
    setIsEditable(false);
  };

  const usersData = users?.pages.flatMap((page: any) => {
    return page?.data?.result?.data.map((user: any) => user);
  });

  const fields = [
    {
      type: FieldType.AsyncSingleSelect,
      control,
      name: 'manager',
      label: t('managerWidget.selectManager'),
      className: '',
      placeholder: t('managerWidget.selectManager'),
      suffixIcon: <></>,
      clearIcon: (
        <Icon name="closeCircle" size={16} className="-mt-0.5 !mr-4" />
      ),
      isClearable: true,
      isLoading: isFetching,
      options: usersData
        ?.map((member: any) => ({
          value: member?.id,
          label: member.fullName,
          disabled: false,
          dataTestId: member?.id,
          rowData: member,
        }))
        .filter((member: any) => member.value !== data?.id),
      isFetchingNextPage,
      fetchNextPage,
      hasNextPage,
      onSearch: (q: string) => setSearch(q),
      dataTestId: 'manager-search',
      onClear: () => reset({ manager: null }),
    },
  ];

  const managerDetails = getUserCardTooltipProps(
    data?.manager || {},
    t('fieldNotSpecified'),
  );

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
                {t('managerWidget.title')}
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
                  <div className="flex space-x-1">
                    <Button
                      variant={Variant.Secondary}
                      label={t('managerWidget.cancelCTA')}
                      size={Size.Small}
                      onClick={() => {
                        setIsEditable(false);
                        reset();
                      }}
                      dataTestId={`contact-info-cancel`}
                    />
                    <Button
                      label={t('managerWidget.saveCTA')}
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
              ) : isEmpty(omitBy(data?.manager, isEmpty)) ? (
                <div className="text-sm text-neutral-500">
                  {t('managerWidget.emptyMessage')}
                </div>
              ) : (
                <Tooltip
                  tooltipContent={
                    <UserCard
                      user={getUserCardTooltipProps(
                        data?.manager,
                        t('fieldNotSpecified'),
                      )}
                    />
                  }
                  variant={TooltipVariant.Light}
                  className="!p-4 !shadow-md !rounded-9xl !z-[999]"
                >
                  <div
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => navigate(`/users/${data?.manager?.userId}`)}
                  >
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
                        {managerDetails.designation?.name ||
                          t('fieldNotSpecified')}
                      </div>
                    </div>
                  </div>
                </Tooltip>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ManagerWidget;
