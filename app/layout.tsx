'use client';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomNavbar from '../src/components/navbar';

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
        <div className="position-fixed">
          <CustomNavbar />
        </div>
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </body>
    </html>
  );
}
