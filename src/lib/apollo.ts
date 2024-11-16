// src/lib/apollo.ts
import { ApolloClient, InMemoryCache } from '@apollo/client'

const SEQUENCER_URL = 'http://localhost:8081/graphql'

// We'll make the URI configurable later
export const apolloClient = new ApolloClient({
  uri: SEQUENCER_URL,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // We can add field policies here as needed
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
})
