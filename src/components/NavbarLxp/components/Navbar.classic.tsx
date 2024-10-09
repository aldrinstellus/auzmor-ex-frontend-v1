import { Logo } from 'components/Logo';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

interface INavbarLxpProps {}

const Navbar: FC<INavbarLxpProps> = ({}) => {
  const { t } = useTranslation('navbar');
  const navbarMenu = [
    {
      id: 'home',
      label: t('learn.home'),
      to: '/',
      show: true,
    },
    {
      id: 'channels',
      label: t('learn.channels'),
      to: '',
      show: true,
    },
    {
      id: 'myLearning',
      label: t('learn.myLearning'),
      to: '/courses',
      show: true,
    },
    {
      id: 'courses',
      label: t('learn.courses'),
      to: '',
      show: true,
    },
    {
      id: 'paths',
      label: t('learn.paths'),
      to: '',
      show: true,
    },
    {
      id: 'events',
      label: t('learn.events'),
      to: '',
      show: true,
    },
    {
      id: 'tasks',
      label: t('learn.tasks'),
      to: '/tasks',
      show: true,
    },
    {
      id: 'mentorship',
      label: t('learn.mentorship'),
      to: '/mentorship',
      show: true,
    },
    {
      id: 'forums',
      label: t('learn.forums'),
      to: '/forums',
      show: true,
    },
  ];
  return (
    <div className="h-[78px] flex items-center justify-center bg-white px-14">
      <div className="w-full max-w-[1440px] flex items-center">
        <Logo />
        <div className="ml-[26px] flex items-center gap-[16px]">
          {navbarMenu
            .filter((item) => item.show)
            .map((item) => (
              <NavLink
                to={item.to}
                key={item.id}
                className="nav-item text-[15px] px-[10px] py-[4px] gap-[8px] transition ease duration-150 hover:text-primary-500 flex items-center"
              >
                {item.label}
              </NavLink>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
