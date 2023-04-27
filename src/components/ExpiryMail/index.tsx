import PasswordExpiry from 'components/PasswordExpiry';
import ResetPassword from 'pages/ResetPassword';
import React, { useEffect, useState } from 'react';

export interface IExpirymailProps {}

const Expirymail: React.FC<IExpirymailProps> = () => {
  const [token, setToken] = useState<null | any>(null);
  useEffect(() => {
    const query = new URLSearchParams(window.location.search.substring(1));
    const newToken = query.get('token');
    if (token) {
      setToken(newToken);
    }
  }, []);

  return (
    <>{!token ? <ResetPassword expiryToken={token} /> : <PasswordExpiry />}</>
  );
};

export default Expirymail;
