import Icon from 'components/Icon';
import React from 'react';
import { NavLink } from 'react-router-dom';

export interface INavbarMenuItemProps {
  nav: {
    label: string;
    icon: string;
    hoverIcon: string;
    linkTo: string;
    dataTestId: string;
    iconSize: number;
    disabled?: boolean;
  };
}

const NavbarMenuItem: React.FC<INavbarMenuItemProps> = ({ nav }) => {
  return nav.disabled ? (
    <div className="flex flex-col items-center" data-testid={nav.dataTestId}>
      <Icon name={nav.icon} size={nav.iconSize} disabled />
      <div className="text-sm text-neutral-200 cursor-default">{nav.label}</div>
    </div>
  ) : (
    <NavLink
      to={nav.linkTo}
      className={({ isActive }) =>
        `${isActive ? 'text-primary-500' : 'text-neutral-500'} group`
      }
    >
      {({ isActive }) => (
        <div
          className="flex flex-col items-center"
          data-testid={nav.dataTestId}
        >
          <Icon
            name={nav.hoverIcon}
            size={nav.iconSize}
            isActive={isActive}
            className={!isActive ? 'hidden group-hover:block' : ''}
          />
          <Icon
            name={nav.icon}
            size={nav.iconSize}
            isActive={isActive}
            className={isActive ? 'hidden' : 'group-hover:hidden'}
          />

          <div className="text-sm group-hover:text-primary-500">
            {nav.label}
          </div>
        </div>
      )}
    </NavLink>
  );
};

export default NavbarMenuItem;
