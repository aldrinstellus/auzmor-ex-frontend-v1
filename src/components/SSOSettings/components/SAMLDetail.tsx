import React, { ReactElement } from 'react';

type SAMLDetailProps = {
  prop: string;
  value: string;
};

const SAMLDetail: React.FC<SAMLDetailProps> = ({
  prop,
  value,
}): ReactElement => {
  return (
    <div className="flex items-center justify-between p-6">
      <p className="font-normal text-neutral-500">{prop}</p>
      <p className="font-bold text-neutral-900">{value}</p>
    </div>
  );
};

export default SAMLDetail;
