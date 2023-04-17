import { QueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { useLoaderData } from 'react-router-dom';

interface IHomeProps {}

interface IPostODT {
  id: number;
  userId: number;
  reactions: number;
  body: string;
  tags: string[];
  title: string;
}

const forbiddenErrorUrl = 'https://httpstat.us/403';
const serverErrorUrl = 'https://httpstat.us/500';
const dummyPostUrl = 'https://dummyjson.com/posts';

// const notFoundErrorUrl = 'https://httpstat.us/404';

// I need to find the status code from the API Calling and then access
// into Error Boundary

const homeDetailQuery = () => ({
  queryKey: ['post-data'],
  queryFn: async () =>
    await axios
      .get(dummyPostUrl)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // need to add response manually - because loader return the queryclient

        // if (error.response.data.code === 500) {
        //   throw new Response('Internal Server Error', { status: 500 });
        // } else if (error.response.data.code === 403) {
        //   throw new Response('Request Forbidden', { status: 403 });
        // }

        console.log(error.response.data.code);
      }),
  staleTime: 5 * 60 * 1000,
});

// ⬇️ loader query definition (takes argument as query client)
// ⬇️ replace any with relevant API types
export const loader = (queryClient: QueryClient) => async (): Promise<any> => {
  // ⬇️ return react-query client store cache (ensureQueryData)
  const query = homeDetailQuery();
  return queryClient.ensureQueryData(query);
};

const Home = (props: IHomeProps) => {
  // ⬇️ use hook to get the data from react query client using useQuery
  const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof loader>>
  >;

  // ⬇️ use hook to get the data after router loads (useLoaderData)
  const { data: postList } = useQuery({
    ...homeDetailQuery(),
    initialData,
  });

  return (
    <div className="flex flex-col items-center">
      <div className="text-lg font-bold">Home Page</div>
      <div className="">
        {postList?.posts?.map((post: IPostODT) => (
          <div className="bg-red-400 m-4 p-4 rounded border-2" key={post.id}>
            <div>{post.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
