import React from 'react';
import clsx from 'clsx';
import {
  Control,
  UseFormResetField,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import EntitySearchModalBody from 'components/EntitySearchModal/components/EntitySearchModalBody';
import {
  EntitySearchModalType,
  IAudienceForm,
} from 'components/EntitySearchModal';
import Icon from 'components/Icon';
import Avatar from 'components/Avatar';
import { IGetUser } from 'queries/users';
import DynamicImagePreview from 'components/DynamicImagePreview';
import { SHOUTOUT_STEPS } from '.';

interface ShoutoutBodyProps {
  step: SHOUTOUT_STEPS;
  triggerSubmit: boolean;
  getFile: (file: any) => void;
  setIsFileAdded: (flag: boolean) => void;
  selectedUserIds: string[];
  users: any[];
}

const Body: React.FC<ShoutoutBodyProps> = ({
  step,
  triggerSubmit,
  getFile,
  setIsFileAdded,
  selectedUserIds,
  users,
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
          entityRenderer={(data: IGetUser) => {
            return (
              <div className="flex space-x-4 w-full pr-2">
                <Avatar
                  name={data?.fullName || 'U'}
                  size={32}
                  image={data?.profileImage?.original}
                />
                <div className="flex space-x-6 w-full">
                  <div className="flex flex-col w-full">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-bold text-neutral-900">
                        {data?.fullName}
                      </div>
                      <div className="flex space-x-[14px] items-center">
                        <div className="flex space-x-1 items-start">
                          <Icon name="briefcase" size={16} />
                          <div className="text-xs font-normal text-neutral-500">
                            {'Chief Financial officer'}
                          </div>
                        </div>

                        <div className="w-1 h-1 bg-neutral-500 rounded-full" />

                        <div className="flex space-x-1 items-start">
                          <Icon name="location" size={16} />
                          <div className="text-xs font-normal text-neutral-500">
                            {'New York, US.'}
                          </div>
                        </div>
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
        />
      )}
      {step === SHOUTOUT_STEPS.ImageSelect && (
        <DynamicImagePreview
          onSubmit={getFile}
          triggerSubmit={triggerSubmit}
          setIsFileAdded={setIsFileAdded}
          users={users}
        />
      )}
    </div>
  );
};

export default Body;
