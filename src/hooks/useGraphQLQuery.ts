import { useQuery } from '@tanstack/react-query'
import { DocumentNode } from 'graphql'
import { apolloClient } from '../lib/apollo'
import { OperationVariables } from '@apollo/client'

// Custom hook to use Apollo Client with React Query
export function useGraphQLQuery<TData = any>(
  key: string[],
  query: DocumentNode,
  options?: {
    enabled?: boolean
    staleTime?: number
    cacheTime?: number
  }
) {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data } = await apolloClient.query<TData>({
        query,
      })
      return data
    },
    ...options,
  })
}
