import Avatar from 'components/Avatar';

import { getFullName, getProfileImage } from 'utils/misc';
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
import { Role } from 'utils/enum';
import { UserRole } from 'queries/users';
import { useTranslation } from 'react-i18next';

type AppProps = {
  isLoading?: boolean;
  data?: any; // IGetUser[]
  selectAllEntity?: () => void;
  deselectAll?: () => void;
};
const ManageAccessTable: FC<AppProps> = ({ isLoading = false, data }) => {
  const { t } = useTranslation('channels');
  const rolesOptions = [
    {
      value: UserRole.Admin,
      label: 'Admin',
      onclick: () => {},
    },

    {
      value: UserRole.Member,
      label: 'Member',
      onclick: () => {},
    },
  ];
  return (
    <>
      <Table>
        <TableHeader className="  sticky top-0 z-10 text-neutral-500 text-base font-bold bg-neutral-200 ">
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
            {data.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium ">
                  <div className=" flex items-center   space-x-4">
                    <Avatar
                      name={getFullName(user?.fullName) || 'U'}
                      size={32}
                      image={getProfileImage(user?.profileImage)}
                      dataTestId="member-profile-pic"
                    />
                    <div
                      className="text-sm font-bold text-neutral-900 whitespace-nowrap line-clamp-1"
                      data-testid="member-name"
                    >
                      {user?.fullName}
                    </div>
                    <div
                      className={`  rounded-lg  px-3 py-1 text-xxs font-medium bg-primary-100 text-primary-600`}
                    >
                      New joinee
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user?.workLocation?.name}</TableCell>
                <TableCell>dumy email</TableCell>
                <TableCell>dummy department</TableCell>

                <TableCell>
                  <div className="rleative">
                    <PopupMenu
                      triggerNode={
                        <Button
                          variant={Variant.Tertiary}
                          className="text-sm font-medium"
                          label={Role.Admin} // it should come from user data
                          rightIcon={'arrowDown'}
                        />
                      }
                      menuItems={rolesOptions} // pass the role options
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
      {/* //loader */}
      {/* <NoDataFound
              className="py-4 w-full"
              searchString={memberSearch}
              message={
                <p>
                  Sorry we can&apos;t find the member you are looking for.
                  <br /> Please check the spelling or try again.
                </p>
              }
              hideClearBtn
              dataTestId={`${dataTestId}-noresult`}
            /> */}{' '}
      {/* // empty state */}
    </>
  );
};
export default ManageAccessTable;
