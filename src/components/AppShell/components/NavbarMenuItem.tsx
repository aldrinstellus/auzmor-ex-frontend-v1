import Icon from 'components/Icon';
import useProduct from 'hooks/useProduct';
import { FC } from 'react';
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
    isActive?: any;
    render?: () => React.ReactNode;
  };
}

const NavbarMenuItem: FC<INavbarMenuItemProps> = ({ nav }) => {
  const { isLxp } = useProduct();

  return nav.disabled ? (
    <div
      className="flex flex-col items-center p-2"
      data-testid={nav.dataTestId}
    >
      <Icon name={nav.icon} size={nav.iconSize} disabled />
      <div className="text-sm text-neutral-200 cursor-default">{nav.label}</div>
    </div>
  ) : (
    <NavLink
      to={nav.linkTo}
      className={({ isActive }) =>
        `${
          isActive || nav.isActive ? 'text-primary-500' : 'text-neutral-500'
        } group p-2`
      }
    >
      {({ isActive: navLinkIsActive }) => {
        const isActive = navLinkIsActive || nav.isActive;
        return (
          <div
            className={`flex ${
              isLxp ? 'flex-row gap-1' : 'flex-col'
            }   items-center`}
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
        );
      }}
    </NavLink>
  );
};

export default NavbarMenuItem;
