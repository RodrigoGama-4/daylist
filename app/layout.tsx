'use client';
import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { UserProvider } from '@/src/providers/UserContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Pangolin&family=Roboto&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full">
        <UserProvider>
          <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
        </UserProvider>
      </body>
    </html>
  );
}

export const apolloClient = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});
