import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import { CreatePostContext } from 'contexts/CreatePostContext';
import React, { useContext } from 'react';

export interface IBodyProps {
  fields: any[];
  selecetedExpiry: any;
}

const Body: React.FC<IBodyProps> = ({ fields, selecetedExpiry }) => {
  const { announcement } = useContext(CreatePostContext);
  return (
    <div className="text-sm text-neutral-900">
      <div className="m-4 min-h-[300px]">
        <div className="flex w-full mb-6">
          <div className="mr-3">
            <Icon name="infoCircleOutline" />
          </div>
          <div className="text-sm text-neutral-500 font-medium">
            This post will be shared as an announcement. Announcements are
            automatically pinned for every user and unpinned when the user marks
            it as read.
          </div>
        </div>
        <form>
          <Layout fields={fields} />
        </form>
        {((selecetedExpiry && selecetedExpiry.label === 'Custom Date') ||
          (announcement && announcement.label === 'Custom Date')) && (
          <Layout fields={fields} className="mt-6" />
        )}
      </div>
    </div>
  );
};

export default Body;
