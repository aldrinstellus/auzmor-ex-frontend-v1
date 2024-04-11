import Avatar from 'components/Avatar';

import { getFullName, getProfileImage } from 'utils/misc';
import Layout, { FieldType } from 'components/Form';
import { useForm } from 'react-hook-form';
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
import { useTranslation } from 'react-i18next';

type AppProps = {
  isLoading?: boolean;
  data?: any; // IGetUser[]
  selectAllEntity?: () => void;
  deselectAll?: () => void;
};
const MemberTable: FC<AppProps> = ({
  isLoading = false,
  selectAllEntity,
  deselectAll,
  data,
}) => {
  const { t } = useTranslation('channels');
  const { control } = useForm({});
  return (
    <>
      <Table>
        <TableHeader className=" sticky top-0 z-10 text-neutral-500 text-base font-bold bg-neutral-200 ">
          <TableRow>
            <TableHead className="w-[362px ] ">
              <div className="flex space-x-4">
                <Layout
                  fields={[
                    {
                      type: FieldType.Checkbox,
                      name: 'selectAll',
                      control,
                      className: 'flex item-center',
                      transform: {
                        input: (value: boolean) => {
                          return value;
                        },
                        output: (e: any) => {
                          if (e.target.checked) {
                            selectAllEntity?.();
                          } else {
                            deselectAll?.();
                          }
                          return e.target.checked;
                        },
                      },
                      // disabled: showSelectedMembers,
                    },
                  ]}
                />
                <div>{t('members.table.fullName')}</div>
              </div>
            </TableHead>
            <TableHead className="w-[200px]">
              {t('members.table.location')}
            </TableHead>
            <TableHead>{t('members.table.title')}</TableHead>
            <TableHead>{t('members.table.department')}</TableHead>
            <TableHead>{t('members.table.email')}</TableHead>
          </TableRow>
        </TableHeader>

        {!isLoading && (
          <TableBody>
            {data.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className=" flex items-center space-x-4">
                    <Layout
                      fields={[
                        {
                          type: FieldType.Checkbox,
                          name: `users.${user.id}`,
                          control,
                          className: 'flex item-center mr-4',
                          transform: {
                            input: () => {},
                            output: () => {},
                          },
                          // defaultChecked: selectedMemberIds.includes(user.id),
                          // dataTestId: `${dataTestId}-select-${user.id}`,
                        },
                      ]}
                    />

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
                  </div>
                </TableCell>
                <TableCell>{user?.workLocation?.name}</TableCell>
                <TableCell>dummy designation</TableCell>
                <TableCell>dumy title</TableCell>
                <TableCell>{user?.workEmail}</TableCell>
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
export default MemberTable;
