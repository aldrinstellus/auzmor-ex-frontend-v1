import React from 'react';

const Toolbar = () => {
  return (
    <div id="toolbar">
      <div className="flex justify-between items-center h-14 ml-5 mr-6 border-t-1 mt-4">
        <div>
          <span className="ql-formats">
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-emoji" />
          </span>
        </div>
        {/* Add hashtags button */}
        <div className="font-bold text-sm text-neutral-900">
          <div>Add Hashtags</div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
