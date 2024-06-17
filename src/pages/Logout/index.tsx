import LogoutScreen from 'images/LogoutScreen.png';
import Button from 'components/Button';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from 'components/Logo';
import { useCheckLogin } from 'queries/account';
import PageLoader from 'components/PageLoader';
import { usePageTitle } from 'hooks/usePageTitle';

const Logout = () => {
  usePageTitle('logout');
  const { data, isLoading, isError } = useCheckLogin();
  const navigate = useNavigate();

  // Show a loader while we check whether they're logged in or not.
  if (isLoading && !isError) {
    return (
      <div className="w-screen h-screen">
        <PageLoader />
      </div>
    );
  }

  // If they stumble upon this page while they're logged in, just redirect them to redirectUrl.
  if (data && !isError) {
    if (data?.data?.result?.data?.redirectUrl)
      navigate(data.data.result.data.redirectUrl);
    else {
      console.log('No redirectUrl found');
      navigate('/home');
    }
  }

  // If data is invalid, it means that they really are logged out.
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
