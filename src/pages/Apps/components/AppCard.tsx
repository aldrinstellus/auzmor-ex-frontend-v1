import Badge from 'components/Badge';
import Card from 'components/Card';
import React, { useEffect, useState } from 'react';
import { App } from 'queries/apps';
import { Link } from 'react-router-dom';
import useHover from 'hooks/useHover';
import Icon from 'components/Icon';
import Divider from 'components/Divider';
import useModal from 'hooks/useModal';
import AppDetailModal from './AppCardDetail';

type AppCardProps = {
  app: App;
};

const AppCard: React.FC<AppCardProps> = ({ app }) => {
  const [appCardHovered, appCardEventHandlers] = useHover();
  const [menuHovered, menuEventHandlers] = useHover();

  const [appDetailModal, openAppDetailModal, closeAppDetailModal] = useModal();

  const appCardMenu = [
    {
      id: 0,
      text: 'Show details',
      icon: 'editReceipt',
      dataTestId: 'something',
      onClick: openAppDetailModal,
      hidden: false,
    },
    {
      id: 1,
      text: 'Feature',
      icon: 'filterLinear',
      dataTestId: 'something',
      onClick: () => {},
      hidden: false,
    },
    {
      id: 3,
      text: 'Edit',
      icon: 'edit',
      dataTestId: 'something',
      onClick: () => {},
      hidden: false,
    },
    {
      id: 4,
      text: 'Delete',
      icon: 'delete',
      dataTestId: 'something',
      onClick: () => {},
      hidden: false,
    },
  ];

  return (
    <div>
      {/* <Link to={app.url} target="_blank"> */}
      <Card
        className="min-w-[320px] max-w-xs min-h-[224px] max-h-56 border-1"
        shadowOnHover
      >
        <div className="pt-2 px-4" {...appCardEventHandlers}>
          <div className="flex justify-end">
            <Badge
              text={app.category}
              textClassName="text-blue-500"
              bgClassName="bg-blue-100"
            />
          </div>
          <div className="pb-8">
            <div className="flex items-center justify-between">
              <img
                src={app?.icon?.original}
                className="p-1 bg-neutral-100 rounded-xl"
                height={48}
                width={48}
              />
              {appCardHovered && (
                <div {...menuEventHandlers}>
                  <Icon name="threeDots" className="relative " />
                  {menuHovered && (
                    <Card className="absolute border-1 rounded-11xl">
                      {appCardMenu.map((menuItem) => (
                        <div key={menuItem.id} onClick={menuItem.onClick}>
                          <div className="flex gap-x-2 cursor-pointer py-2 px-6 items-center hover:bg-blue-50">
                            <Icon
                              name={menuItem.icon}
                              size={16}
                              stroke="#000"
                              disabled
                            />
                            <p className="text-neutral-900 text-sm ">
                              {menuItem.text}
                            </p>
                          </div>
                          <Divider />
                        </div>
                      ))}
                    </Card>
                  )}
                </div>
              )}
            </div>
            <p className="text-neutral-900 font-bold py-2 text-lg">
              {app.label}
            </p>
            <p className="text-neutral-500 line-clamp-3">{app.description}</p>
          </div>
        </div>
      </Card>
      {/* </Link> */}
      <AppDetailModal
        open={appDetailModal}
        closeModal={closeAppDetailModal}
        app={app}
      />
    </div>
  );
};

export default AppCard;
