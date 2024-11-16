import './App.css'
import { ApolloProvider } from '@apollo/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { apolloClient } from './lib/apollo';
import { NodeStatus } from './components/NodeStatus';
import { mockTransactions } from './mocks/data';
import { TransactionsTable } from './components/TransactionsTable';
import { LatestTransactions } from './components/LatestTransactions';
import { ExplorerTabs } from './components/ExplorerTabs';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      refetchOnWindowFocus: false,
    },
  },
});



function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen w-screen h-screen">
          <ExplorerTabs />
        </div>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ApolloProvider>
  );
}


export default App


