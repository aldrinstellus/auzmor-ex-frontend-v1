import Modal from 'components/Modal';
import Icon from 'components/Icon';
import React, { FC, useState } from 'react';
import { syncUser } from 'queries/intergration';


interface ConfigureDeelProps {
  show: boolean;
  closeModal: () => void;
}

const ConfigureDeel: FC<ConfigureDeelProps> = ({ show, closeModal }) => {
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleSyncNow =  async () => {
    setIsLoading(true);
    try {
      const response = await syncUser();
    const currentTime = new Date().toLocaleString();
    setLastSyncTime(currentTime);
    console.log('Sync successful:', response.data);
  } catch (error) {
    console.error('Sync failed:', error);
  } finally {
    setIsLoading(false);
  }
  };

   return (
    <Modal open={show} className="max-w-[600px] max-h-[600px]">
    {/* Header */}
    <div className="relative h-full">
      <div className="flex items-start justify-between absolute top-0 left-0 right-0 p-4">
        <div className="w-full">
          <div className="flex items-center space-x-2">
            <img
              src={require('images/DeelLogo.png')}
              alt="Deel Logo"
              className="h-[40px]"
            />
            <p className="font-extrabold text-black text-lg">Deel HR</p>
          </div>
          <div className="border-b border-neutral-400 my-5 w-full"></div>
          <p className="font-bold text-black mt-2">Data Sync</p>
          <p className="font-normal font-bold text-sm font-medium">
            Data from your Deel HR account will be synced to Auzmor office.
          </p>
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-neutral-1000 font-extrabold">
              Last sync: {lastSyncTime || 'No sync yet'}
            </p>
            <button
              className={`bg-green-500 text-white text-sm px-4 py-2 rounded-full hover:bg-green-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleSyncNow}
              disabled={isLoading}
            >
              {isLoading ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Note: Data syncs automatically after every 24 hours.
          </p>
        </div>
        <Icon
          className="p-2 cursor-pointer font-extrabold"
          name="close"
          size={35}
          onClick={closeModal}
          color="text-black"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between h-[560px] pt-24 p-4">
        <div className=""></div>
        <div className="flex justify-between border-t border-neutral-400 pt-4">
          <button className="text-black hover:underline flex items-center text-extrabold">
            <Icon name="minus" className="mr-2" />
            Remove Integration
          </button>
          <div className="flex space-x-2">
            <button
              className="text-black hover:underline px-4 py-2 rounded-full hover:bg-white-600 font-bold"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="bg-green-500 text-white text-sm px-4 py-2 rounded-full hover:bg-green-600"
              onClick={closeModal}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </Modal>
);
};

export default ConfigureDeel;
