import Icon from 'components/Icon';
import React from 'react';
import { twConfig } from 'utils/misc';

interface IToolbarProps {
  isCharLimit: boolean;
}

const Toolbar: React.FC<IToolbarProps> = ({ isCharLimit }) => {
  return (
    <div id="toolbar">
      <div className="relative">
        {isCharLimit && (
          <div className="bg-red-50 border-y-1 border-red-300 px-4 py-2 flex justify-between absolute w-full bottom-full items-center">
            <div className="flex items-center">
              <Icon
                name="infoCircleOutline"
                size={32}
                color="text-red-500"
                className="p-1.5 bg-red-100 rounded-7xl mr-2"
              />
              <div className="truncate text-red-500 text-sm">
                You have reached maximum character limit.
              </div>
            </div>
            <div className="text-sm font-bold text-red-500">
              3000+ characters
            </div>
          </div>
        )}
        <div className="flex justify-between items-center h-14 pl-5 pr-6 border-t-1 py-4">
          <div className="flex items-center">
            <span className="ql-formats">
              <button className="ql-bold" />
              <button className="ql-italic" />
              <button className="ql-underline" />
              <button className="ql-emoji" />
            </span>
          </div>
          <div className="font-bold text-sm text-neutral-900">
            <div>Add Hashtags</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
