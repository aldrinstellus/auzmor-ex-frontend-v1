import Icon from 'components/Icon';
import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import NavbarMenuButton from './NavbarMenuButton';

export interface INavbarMenuItemProps {
  nav: {
    label: string;
    icon: string;
    hoverIcon: string;
    linkTo: string;
    dataTestId: string;
    iconSize: number;
    disabled?: boolean;
    isActive?: any;
    render?: () => React.ReactNode;
  };
}

const NavbarMenuItem: FC<INavbarMenuItemProps> = ({ nav }) => {
  if (nav.render) {
    return (
      <div className="flex flex-col items-center cursor-pointer">
        {nav?.render?.()}
      </div>
    );
  }
  return nav.disabled ? (
    <div
      className="flex flex-col items-center p-2"
      data-testid={nav.dataTestId}
    >
      <Icon name={nav.icon} size={nav.iconSize} disabled />
      <div className="text-sm text-neutral-200 cursor-default">{nav.label}</div>
    </div>
  ) : (
    <NavLink to={nav.linkTo ?? ''}>
      {({ isActive }) => (
        <NavbarMenuButton
          nav={{ ...nav, isActive: isActive || nav.isActive }}
        />
      )}
    </NavLink>
  );
};

export default NavbarMenuItem;
