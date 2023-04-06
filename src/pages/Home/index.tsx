import { QueryClient } from '@tanstack/react-query';
import React from 'react';

interface IHomeProps {}

// ⬇️ loader query definition (takes argument as query client)
// ⬇️ replace any with relevant API types
export const loader = (queryClient: QueryClient) => async (): Promise<any> => {
  // ⬇️ return react-query client store cache (ensureQueryData)
};

const Home = (props: IHomeProps) => {
  // ⬇️ use hook to get the data after router loads (useLoaderData)
  // ⬇️ use hook to get the data from react query client using useQuery
  return <div>Home Page</div>;
};

export default Home;
