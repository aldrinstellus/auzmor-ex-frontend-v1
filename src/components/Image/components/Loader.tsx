import React, { ReactElement } from 'react';

const Loader: React.FC = (): ReactElement => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <img src="https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif" />
    </div>
  );
};

export default Loader;
