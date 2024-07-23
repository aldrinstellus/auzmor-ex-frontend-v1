import Avatar from 'components/Avatar';

import { getFullName, getProfileImage, isNewEntity } from 'utils/misc';
import { FC } from 'react';
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
import { CHANNEL_ROLE, IChannel } from 'stores/channelStore';
import queryClient from 'utils/queryClient';
import useAuth from 'hooks/useAuth';

type AppProps = {
  isLoading?: boolean;
  data: any;
  selectAllEntity?: () => void;
  deselectAll?: () => void;
  channelData: IChannel;
};
const ManageAccessTable: FC<AppProps> = ({ isLoading = false, data }) => {
  const { t } = useTranslation('channelDetail', { keyPrefix: 'manageAccess' });
  const { channelId } = useParams();

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
                  <div className=" flex items-center  space-x-4">
                    <Avatar
                      name={getFullName(user) || 'U'}
                      size={32}
                      image={getProfileImage(user?.profileImage)}
                      dataTestId="member-profile-pic"
                    />
                    <div
                      className="text-base font-bold text-neutral-900 whitespace-nowrap line-clamp-1  "
                      data-testid="member-name"
                    >
                      {user?.fullName}
                    </div>
                    {isNewEntity(user?.createdAt) && (
                      <div
                        className={`rounded-lg  px-3 py-1 text-xxs font-medium bg-primary-100 text-primary-600`}
                      >
                        {t('table.newJoinee')}
                      </div>
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
                            <div className=" pl-4 !text-sm !font-medium capitalize">
                              {user?.role?.toLowerCase()}
                            </div>
                          ) : (
                            <Button
                              variant={Variant.Tertiary}
                              className="!text-sm !font-medium capitalize"
                              label={user?.role?.toLowerCase() || 'Admin'}
                              rightIcon={'arrowDown'}
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
          </TableBody>
        )}
      </Table>
      {isLoading && (
        <div className="flex  items-center p-4 justify-center    ">
          <Spinner />
        </div>
      )}
    </>
  );
};
export default ManageAccessTable;
