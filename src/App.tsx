import './App.css'
import { ApolloProvider } from '@apollo/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { apolloClient } from './lib/apollo';
import { NodeStatus } from './components/NodeStatus';

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
        <div className="min-h-screen bg-gray-50 w-screen h-screen bg-red-300">
          {/* Your app content */}
          <h1>Hello ProtoStar</h1>
          <NodeStatus />
        </div>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ApolloProvider>
  );
}


export default App


