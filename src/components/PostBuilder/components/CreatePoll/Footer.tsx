import Button, { Variant } from 'components/Button';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <div className="bg-blue-50 flex items-center justify-end p-3 gap-x-3 rounded-9xl w-full">
      <Button label="Back" variant={Variant.Secondary} />
      <Button label="Next" variant={Variant.Secondary} />
    </div>
  );
};

export default Footer;
