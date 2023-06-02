import React from 'react';
import LogoutScreen from 'images/LogoutScreen.png';
import Button from 'components/Button';
import { Link } from 'react-router-dom';
import { Logo } from 'components/Logo';

const Logout = () => {
  return (
    <>
      <div className="bg-white shadow h-16 w-full flex items-center justify-start px-8">
        <Link to="/" data-testid="auzmor-office">
          <Logo />
        </Link>
      </div>
      <div className="flex flex-col justify-center items-center bg-white m-14 space-y-8 py-20">
        <div className="text-2xl font-bold" data-testId="logout-confirm-msg">
          You are now logged out.
        </div>
        <img src={LogoutScreen} alt="Logout Screen" />
        <Link to="/login">
          <Button
            label="Go back to Login"
            className="mb-20"
            dataTestId="logout-login-redirect-btn"
          />
        </Link>
      </div>
    </>
  );
};

export default Logout;
