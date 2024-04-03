import Icon from 'components/Icon';
import useProduct from 'hooks/useProduct';
import { FC } from 'react';

export interface INavbarMenuButtonProps {
  nav: {
    label: string;
    icon: string;
    hoverIcon: string;
    dataTestId: string;
    iconSize: number;
    isActive?: any;
  };
}

const NavbarMenuButton: FC<INavbarMenuButtonProps> = ({ nav }) => {
  const { isLxp } = useProduct();
  return (
    <div
      className={`flex ${
        isLxp ? 'flex-row gap-1' : 'flex-col'
      }    items-center group p-2 ${
        nav.isActive ? 'text-primary-500' : 'text-neutral-500'
      }`}
      data-testid={nav.dataTestId}
    >
      <Icon
        name={nav.hoverIcon}
        size={nav.iconSize}
        isActive={nav.isActive}
        className={!nav.isActive ? 'hidden group-hover:block' : ''}
      />
      <Icon
        name={nav.icon}
        size={nav.iconSize}
        isActive={nav.isActive}
        className={nav.isActive ? 'hidden' : 'group-hover:hidden'}
      />

      <div className="text-sm group-hover:text-primary-500">{nav.label}</div>
    </div>
  );
};

export default NavbarMenuButton;
