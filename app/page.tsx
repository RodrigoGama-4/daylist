'use client';
import { useQuery } from '@apollo/client';
import { graphql } from '@/graphql/types';

const GET_DATA = graphql(`
  query Query {
    hello
  }
`);

export default function Home() {
  const { loading, error, data } = useQuery(GET_DATA);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <main>
      <h1>Daylist</h1>
      <span>
        {data?.hello} <a href="/graphql">{}</a>
      </span>
    </main>
  );
}
