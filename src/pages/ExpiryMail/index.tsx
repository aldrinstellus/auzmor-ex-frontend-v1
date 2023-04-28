import PasswordExpiry from 'pages/PasswordExpiry';
import ResetPassword from 'pages/ResetPassword';
import React, { useEffect, useState } from 'react';

export interface IExpirymailProps {}

const Expirymail: React.FC<IExpirymailProps> = () => {
  const [token, setToken] = useState<null | any>(null);
  useEffect(() => {
    const query = new URLSearchParams(window.location.search.substring(1));
    const newToken = query.get('token');
    if (newToken) {
      setToken(newToken);
    }
  }, []);

  return <>{token ? <ResetPassword token={token} /> : <PasswordExpiry />}</>;
};

export default Expirymail;
