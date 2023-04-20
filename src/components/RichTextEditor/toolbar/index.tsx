import React from 'react';
import { mention } from '../config';

export const formats = [
  'bold',
  'italic',
  'underline',
  'mention',
  'link',
  'emoji',
];

export const modules = {
  toolbar: {
    container: '#toolbar',
  },
  mention: mention,
  autoLinks: true,
  'emoji-toolbar': true,
};

const Toolbar = () => {
  return (
    <div id="toolbar">
      <div className="border-t-2">
        <div className="flex justify-between items-center h-14 ml-5 mr-6 ">
          <div className="">
            <span className="ql-formats">
              <button className="ql-bold"></button>
              <button className="ql-italic">
                <span></span>
              </button>
              <button className="ql-underline">
                <span></span>
              </button>

              <button className="ql-emoji" />
            </span>
          </div>
          {/* Add hashtags button */}
          <div className="font-bold text-sm text-neutral-900">
            <div>Add Hashtags</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
