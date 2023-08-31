import { Menu } from '@headlessui/react';
import Icon from 'components/Icon';
import Spinner from 'components/Spinner';
import { useAudience } from 'queries/audience';
import { IAudience } from 'queries/post';
import React from 'react';

interface IAudiencePopupProps {
  entityId?: string;
  audience?: IAudience[];
  title?: string;
}

const AudiencePopup: React.FC<IAudiencePopupProps> = ({
  entityId,
  audience,
  title = 'Posted to:',
}) => {
  if (audience && audience.length && entityId) {
    const { data, error, refetch, isLoading } = useAudience(entityId, {
      enabled: false,
    });
    return (
      <div className="relative">
        <Menu>
          <Menu.Button as="div">
            <Icon name="noteFavourite" size={16} />
          </Menu.Button>
          <Menu.Items
            className={`bg-white rounded-9xl shadow-lg absolute z-[99999] overflow-hidden min-w-[256px] border border-neutral-200`}
          >
            {({ open }) => {
              if (!data && open && !error) {
                refetch();
              }
              return isLoading ? (
                <Spinner />
              ) : data ? (
                <>
                  <div className="px-6 py-3 text-sm text-neutral-900 font-medium">
                    {title}
                  </div>

                  {/* <div className="bg-blue-50 px-6 py-1 text-neutral-500 text-xs font-medium">
                    Channels
                  </div>
                  <div className="flex items-center px-6 py-3 border-b border-neutral-200">
                    <div className="w-4 h-4 rounded-full bg-blue-500 mr-2.5"></div>
                    <div className="text-xs font-medium text-neutral-900">
                      HR updates
                    </div>
                  </div> */}

                  <div className="bg-blue-50 px-6 py-1 text-neutral-500 text-xs font-medium">
                    Teams
                  </div>
                  <Menu.Item>
                    <div className="flex items-center px-6 py-3 border-b border-neutral-200">
                      <div className="w-4 h-4 rounded-full bg-blue-500 mr-2.5"></div>
                      <div className="text-xs font-medium text-neutral-900">
                        HR updates
                      </div>
                    </div>
                  </Menu.Item>
                </>
              ) : (
                <div className="px-6 py-3">No data</div>
              );
            }}
          </Menu.Items>
        </Menu>
      </div>
    );
  }
  return <Icon name="global" size={16} />;
};

export default AudiencePopup;
