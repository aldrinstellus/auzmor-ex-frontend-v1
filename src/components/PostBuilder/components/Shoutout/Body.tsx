import clsx from 'clsx';
import EntitySearchModalBody from 'components/EntitySearchModal/components/EntitySearchModalBody';
import { EntitySearchModalType } from 'components/EntitySearchModal';
import Icon from 'components/Icon';
import Avatar from 'components/Avatar';
import { IGetUser, UserStatus } from 'queries/users';
import DynamicImagePreview from 'components/DynamicImagePreview';
import { SHOUTOUT_STEPS } from '.';
import { getProfileImage } from 'utils/misc';
import { FC } from 'react';
import { truncate } from 'lodash';
import Tooltip from 'components/Tooltip';

interface ShoutoutBodyProps {
  step: SHOUTOUT_STEPS;
  triggerSubmit: boolean;
  getFile: (file: any) => void;
  setIsFileAdded: (flag: boolean) => void;
  selectedUserIds: string[];
  users: any[];
  shoutoutTemplate: any;
  setShoutoutTemplate?: ({ file, type }: { file: any; type: string }) => void;
}

const Body: FC<ShoutoutBodyProps> = ({
  step,
  triggerSubmit,
  getFile,
  setIsFileAdded,
  selectedUserIds,
  users,
  shoutoutTemplate,
  setShoutoutTemplate,
}) => {
  return (
    <div
      className={clsx({
        'max-h-[510px] overflow-y-auto': step === SHOUTOUT_STEPS.ImageSelect,
      })}
    >
      {step === SHOUTOUT_STEPS.UserSelect && (
        <EntitySearchModalBody
          entityType={EntitySearchModalType.User}
          selectedMemberIds={selectedUserIds}
          dataTestId="kudos"
          entitySearchLabel="Give kudos to:"
          hideCurrentUser
          showJobTitleFilter
          entityRenderer={(data: IGetUser) => {
            return (
              <div className="flex space-x-4 w-full pr-5">
                <Avatar
                  name={data?.fullName || 'U'}
                  size={32}
                  image={getProfileImage(data)}
                />
                <div className="flex space-x-6 w-full">
                  <div className="flex flex-col w-full">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-bold text-neutral-900">
                        {data?.fullName}
                      </div>
                      <div className="flex space-x-[14px] items-center">
                        {data?.designation?.name && (
                          <div className="flex space-x-1 items-start">
                            <Icon name="briefcase" size={16} />
                            <Tooltip
                              tooltipContent={data?.designation.name}
                              showTooltip={data?.designation.name.length > 24}
                            >
                              <div className="text-xs font-normal text-neutral-500 max-w-[128px]">
                                {truncate(data?.designation.name, {
                                  length: 22,
                                })}
                              </div>
                            </Tooltip>
                          </div>
                        )}
                        {data?.designation && data?.workLocation?.name && (
                          <div className="w-1 h-1 bg-neutral-500 rounded-full" />
                        )}
                        {data?.workLocation?.name && (
                          <div className="flex space-x-1 items-start">
                            <Icon name="location" size={16} />
                            <Tooltip
                              tooltipContent={data?.workLocation.name}
                              showTooltip={data?.workLocation.name.length > 24}
                            >
                              <div className="text-xs font-normal text-neutral-500 max-w-[128px]">
                                {truncate(data?.workLocation.name, {
                                  length: 22,
                                })}
                              </div>
                            </Tooltip>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs font-normal text-neutral-500">
                      {data?.primaryEmail}
                    </div>
                  </div>
                </div>
              </div>
            );
          }}
          usersQueryParams={{ status: [UserStatus.Active] }}
        />
      )}
      {step === SHOUTOUT_STEPS.ImageSelect && (
        <DynamicImagePreview
          onSubmit={getFile}
          triggerSubmit={triggerSubmit}
          setIsFileAdded={setIsFileAdded}
          users={users}
          selectedTemplate={shoutoutTemplate}
          setShoutoutTemplate={setShoutoutTemplate}
        />
      )}
    </div>
  );
};

export default Body;
