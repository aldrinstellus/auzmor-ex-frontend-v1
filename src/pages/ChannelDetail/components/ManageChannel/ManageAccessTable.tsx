import Avatar from 'components/Avatar';

import { getFullName, getProfileImage, isNewEntity } from 'utils/misc';
import { FC, useEffect } from 'react';
import Spinner from 'components/Spinner';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from 'components/Table';
import PopupMenu from 'components/PopupMenu';
import Button, { Variant } from 'components/Button';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { updateMemberRole } from 'queries/channel';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';

import { useParams } from 'react-router-dom';
import { CHANNEL_ROLE, useChannelStore } from 'stores/channelStore';
import queryClient from 'utils/queryClient';
import useAuth from 'hooks/useAuth';
import { useInView } from 'react-intersection-observer';

type AppProps = {
  isLoading?: boolean;
  data: any;
  fetchNextPage?: () => any;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
};
const ManageAccessTable: FC<AppProps> = ({
  isLoading = false,
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage = () => {},
  data,
}) => {
  const { t } = useTranslation('channelDetail', { keyPrefix: 'manageAccess' });
  const { channelId = '' } = useParams();
  const channel = useChannelStore((state) => state.channels)[channelId];

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);
  const { user: currentUser } = useAuth();
  const updateMemberRoleMutation = useMutation({
    mutationFn: updateMemberRole,
    mutationKey: ['update-channel-member-role'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channel-members'] });
      successToastConfig({
        content: `Member role has been updated successfully`,
      });
    },
  });

  return (
    <>
      <Table>
        <TableHeader className=" sticky top-0 z-10 text-neutral-500 text-base font-bold bg-neutral-100 ">
          <TableRow>
            <TableHead className=" pl-[44px] ">
              <div className="flex ">
                <div>{t('table.fullName')}</div>
              </div>
            </TableHead>
            <TableHead className="">{t('table.designation')}</TableHead>
            <TableHead>{t('table.email')}</TableHead>
            <TableHead className="pl-8">{t('table.role')}</TableHead>
          </TableRow>
        </TableHeader>

        {!isLoading && (
          <TableBody>
            {data?.map((user: any) => (
              <TableRow
                className=" hover:bg-primary-50 font-normal text-base "
                key={user?.id}
              >
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Avatar
                      name={getFullName(user) || 'U'}
                      size={32}
                      image={getProfileImage(user)}
                      dataTestId="member-profile-pic"
                    />
                    <div
                      className="text-base font-bold text-neutral-900 whitespace-nowrap line-clamp-1  "
                      data-testid="member-name"
                    >
                      {user?.fullName}
                    </div>
                    {!isNewEntity(channel?.createdAt) &&
                      isNewEntity(user.createdAt) && (
                        <span
                          className={`rounded-lg  px-2 py-0.5 text-xs font-bold bg-primary-50 text-primary-600`}
                        >
                          {t('table.newJoinee')}
                        </span>
                      )}
                  </div>
                </TableCell>
                <TableCell>{user?.designation || 'Not specified'}</TableCell>
                <TableCell>{user?.email}</TableCell>
                <TableCell>
                  <div className="relative">
                    <PopupMenu
                      disabled={user?.userId === currentUser?.id} // disable popup menu for current user
                      triggerNode={
                        <>
                          {user?.userId === currentUser?.id ? (
                            <div className=" pl-4 !text-sm !font-medium capitalize w-28 text-center">
                              {user?.role?.toLowerCase()}
                            </div>
                          ) : (
                            <Button
                              variant={Variant.Tertiary}
                              className="!text-sm !font-medium capitalize !bg-primary-50 w-32"
                              label={user?.role?.toLowerCase() || 'Admin'}
                              rightIcon={'arrowDown'}
                              disabled={
                                user.role === CHANNEL_ROLE.Admin &&
                                (user?.globalRole === 'PRIMARY_ADMIN' ||
                                  user?.globalRole === 'ADMIN')
                              }
                            />
                          )}
                        </>
                      }
                      menuItems={
                        [
                          {
                            value: CHANNEL_ROLE.Admin,
                            label: t('table.admin'),
                            onClick: () => {
                              updateMemberRoleMutation.mutate({
                                id: user?.id,
                                channelId: channelId,
                                role: CHANNEL_ROLE.Admin,
                              });
                            },
                          },

                          {
                            value: CHANNEL_ROLE.Member,
                            label: t('table.member'),
                            onClick: () => {
                              updateMemberRoleMutation.mutate({
                                id: user?.id,
                                channelId: channelId,
                                role: CHANNEL_ROLE.Member,
                              });
                            },
                          },
                        ] as any
                      }
                      className=" w-fit "
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {hasNextPage && !isFetchingNextPage && (
              <TableRow ref={ref}></TableRow>
            )}
          </TableBody>
        )}
      </Table>
      {isFetchingNextPage && (
        <div className="flex items-center w-full justify-center ">
          <Spinner />
        </div>
      )}
    </>
  );
};
export default ManageAccessTable;
