import Spinner from 'components/Spinner';
import React, { useEffect } from 'react';
import usePoller from '../usePoller';
import { useMutation } from '@tanstack/react-query';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';

type AppProps = {
  importId: string;
  setNextStep: (...args: any) => any;
};

const WaitForParse: React.FC<AppProps> = ({ importId, setNextStep }) => {
  const { getApi } = usePermissions();
  const { ready } = usePoller({ importId, action: 'parse' });

  const validateImport = getApi(ApiEnum.ValidateImport);
  const validateUserMutation = useMutation(() => validateImport(importId), {
    onError: () => {},
    onSuccess: () => {
      setNextStep();
    },
  });

  useEffect(() => {
    if (ready) {
      validateUserMutation.mutate();
    }
  }, [ready]);

  return (
    <div className="p-12 flex justify-center items-center">
      <Spinner />
    </div>
  );
};

export default WaitForParse;
