import { usePageTitle } from 'hooks/usePageTitle';
import { FC } from 'react';

interface IRegisterationProps {}

const Registration: FC<IRegisterationProps> = () => {
  usePageTitle('register');
  return <div>Registeration Page</div>;
};

export default Registration;
