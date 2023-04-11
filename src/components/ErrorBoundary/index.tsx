import React from 'react';
import {
  Navigate,
  isRouteErrorResponse,
  useRouteError,
} from 'react-router-dom';

interface IErrorBoundaryProps {}

const ErrorBoundary: React.FC<IErrorBoundaryProps> = () => {
  const error = useRouteError() as Error;
  console.log('error->', error);
  if (isRouteErrorResponse(error)) {
    if (error.status === 403) {
      return (
        <div className="flex flex-col items-center">
          <h2>403 Forbidden Request</h2>
          <div>You dont have permission to this request</div>
        </div>
      );
    }
    if (error.status === 500) {
      return <Navigate to="/500" />;
    }
  }
  return <div>something went wrong !</div>;
};

export default ErrorBoundary;
