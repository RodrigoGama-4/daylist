'use client';
import { useQuery } from '@apollo/client';
import { graphql } from '@/graphql/types';

const GET_DATA = graphql(`
  query Query {
    hello
    world
  }
`);

export default function Home() {
  const { loading, error, data } = useQuery(GET_DATA);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <main>
      <h1>Daylist</h1>
      <p>
        {data?.hello + ' '}
        <span>
          <a href="graphql" className="link-info">
            {data?.world}
          </a>
        </span>
      </p>
    </main>
  );
}
