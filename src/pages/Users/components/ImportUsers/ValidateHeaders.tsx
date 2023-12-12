import Icon from 'components/Icon';
import Spinner from 'components/Spinner';
import React from 'react';

type AppProps = {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
};

const ValidateHeaders: React.FC<AppProps> = ({
  isLoading,
  isSuccess,
  isError,
}) => {
  if (isLoading) {
    return (
      <div className="px-6 pt-2 pb-4 space-y-4">
        <div className="v-center">
          <Spinner className="!h-5 !w-5" />
          <div className="text-sm text-neutral-900 pl-1">
            Checking for headers
          </div>
        </div>
        <div className="v-center">
          <Spinner className="!h-5 !w-5" />
          <div className="text-sm text-neutral-900 pl-1">Mapping Columns</div>
        </div>
      </div>
    );
  }
  if (isSuccess) {
    return (
      <div className="px-6 pt-2 pb-4 space-y-4">
        <div className="v-center">
          <Icon name="boldTick" size={20} className="text-primary-500" />
          <div className="text-sm text-neutral-900">Checking for headers</div>
        </div>
        <div className="v-center">
          <Icon name="boldTick" size={20} className="text-primary-500" />
          <div className="text-sm text-neutral-900">Mapping Columns</div>
        </div>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="px-6 pt-2 pb-4 space-y-4">
        <div className="v-center">
          <Spinner className="!h-5 !w-5" />
          <div className="text-sm text-neutral-900 pl-1">
            Checking for headers
          </div>
        </div>
        <div className="v-center">
          <Spinner className="!h-5 !w-5" />
          <div className="text-sm text-neutral-900 pl-1">Mapping Columns</div>
        </div>
      </div>
    );
  }
  return null;
};

export default ValidateHeaders;
