import Icon from 'components/Icon';
import useHover from 'hooks/useHover';
import React from 'react';
import { NavLink } from 'react-router-dom';

export interface INavbarMenuItemProps {
  nav: {
    label: string;
    icon: string;
    linkTo: string;
    dataTestId: string;
    iconSize: number;
    disabled?: boolean;
  };
}

const NavbarMenuItem: React.FC<INavbarMenuItemProps> = ({ nav }) => {
  return (
    <NavLink
      to={nav.linkTo}
      key={nav.label}
      className={({ isActive }) =>
        `${isActive ? 'text-primary-500' : 'text-neutral-500'} group`
      }
    >
      {({ isActive }) => (
        <div
          className="flex flex-col items-center"
          data-testid={nav.dataTestId}
        >
          <Icon name={nav.icon} size={nav.iconSize} isActive={isActive} />
          <div className="text-sm group-hover:text-primary-500">
            {nav.label}
          </div>
        </div>
      )}
    </NavLink>
  );
};

export default NavbarMenuItem;
