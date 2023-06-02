'use client';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import 'bootstrap/dist/css/bootstrap.min.css';

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Daylist</title>
      </head>
      <body>
        <ApolloProvider client={client}>
          <>{children}</>
        </ApolloProvider>
      </body>
    </html>
  );
}
