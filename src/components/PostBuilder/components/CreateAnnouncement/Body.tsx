import Layout from 'components/Form';
import Icon from 'components/Icon';
import { CreatePostContext } from 'contexts/CreatePostContext';
import React, { useContext } from 'react';

export interface IBodyProps {
  expiryFields: Array<Record<string, any>>;
  datepickerFields: Array<Record<string, any>>;
  selecetedExpiry: any;
}

const Body: React.FC<IBodyProps> = ({
  expiryFields,
  selecetedExpiry,
  datepickerFields,
}) => {
  const { announcement } = useContext(CreatePostContext);
  return (
    <div className="text-sm text-neutral-900">
      <div className="m-4 min-h-[300px]">
        <div className="flex w-full mb-6" data-testid="announcement-tooltip">
          <div className="mr-3">
            <Icon name="infoCircleOutline" />
          </div>
          <div className="text-sm text-neutral-500 font-medium">
            This post will be shared as an announcement. Announcements are
            automatically pinned for every user and unpinned when the user marks
            it as read.
          </div>
        </div>
        <form data-testid="feed-announcement-expire">
          <Layout fields={expiryFields} />
        </form>
        {((selecetedExpiry && selecetedExpiry.label === 'Custom Date') ||
          (!!!selecetedExpiry &&
            announcement &&
            announcement.label === 'Custom Date')) && (
          <Layout fields={datepickerFields} className="mt-6" />
        )}
      </div>
    </div>
  );
};

export default Body;
