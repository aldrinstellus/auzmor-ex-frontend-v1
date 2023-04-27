import React, { ReactNode } from 'react';
import Menu from '@headlessui/react';

interface IMenuItems {}

export interface IPopupMenuProps {
  triggerNode: ReactNode;
  menuItems: IMenuItems;
}

const PopupMenu: React.FC<IPopupMenuProps> = () => {
  return <></>;
};

export default PopupMenu;
