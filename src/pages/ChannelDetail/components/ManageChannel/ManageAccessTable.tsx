import Avatar from 'components/Avatar';

import {
  getFullName,
  getProfileImage,
  isNewEntity,
  twConfig,
} from 'utils/misc';
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
import { UserRole } from 'queries/users';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { updateMemberRole } from 'queries/channel';
import { toast } from 'react-toastify';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import Icon from 'components/Icon';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import { useParams } from 'react-router-dom';
import { CHANNEL_ROLE } from 'stores/channelStore';

type AppProps = {
  isLoading?: boolean;
  data?: any;
  selectAllEntity?: () => void;
  deselectAll?: () => void;
};
const ManageAccessTable: FC<AppProps> = ({ isLoading = false, data }) => {
  const { t } = useTranslation('channels');
  const { channelId } = useParams();

  const updateMemberRoleMutation = useMutation({
    mutationFn: updateMemberRole,
    mutationKey: ['update-channel-member-role'],
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ['users'] });
      toast(
        <SuccessToast content={`Member role has been updated successfully`} />,
        {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              color="text-primary-500"
              size={20}
            />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.primary['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
          theme: 'dark',
        },
      );
    },
  });

  return (
    <>
      <Table>
        <TableHeader className=" sticky top-0 z-10 text-neutral-500 text-base font-bold bg-neutral-100 ">
          <TableRow>
            <TableHead className=" pl-[44px] ">
              <div className="flex ">
                <div>{t('manageAccess.table.fullName')}</div>
              </div>
            </TableHead>
            <TableHead className="">
              {t('manageAccess.table.location')}
            </TableHead>
            <TableHead>{t('manageAccess.table.email')}</TableHead>
            <TableHead>{t('manageAccess.table.department')}</TableHead>
            <TableHead className="pl-8">
              {t('manageAccess.table.role')}
            </TableHead>
          </TableRow>
        </TableHeader>

        {!isLoading && (
          <TableBody>
            {data?.map((user: any) => (
              <TableRow
                className=" hover:bg-primary-50 font-normal text-base "
                key={user.id}
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
                        New joinee
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{user?.location || 'Not specified'}</TableCell>
                <TableCell>{user?.email}</TableCell>
                <TableCell>
                  {user?.designation?.name || 'Not specified'}
                </TableCell>
                <TableCell>
                  <div className="rleative">
                    <PopupMenu
                      triggerNode={
                        <Button
                          variant={Variant.Tertiary}
                          className="!text-sm !font-medium capitalize"
                          label={user?.role || 'Admin'}
                          rightIcon={'arrowDown'}
                        />
                      }
                      menuItems={
                        [
                          {
                            value: UserRole.Admin,
                            label: 'Admin',
                            onClick: () => {
                              updateMemberRoleMutation.mutate({
                                id: user?.id,
                                channelId: channelId,
                                role: CHANNEL_ROLE.Admin,
                              });
                            },
                          },

                          {
                            value: UserRole.Member,
                            label: 'Member',
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
