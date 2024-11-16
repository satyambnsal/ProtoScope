import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { DocumentNode } from 'graphql'
import { apolloClient } from '../lib/apollo'
import { OperationVariables } from '@apollo/client'

export function useGraphQLQuery<
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables
>(
  key: string[],
  query: DocumentNode,
  variables?: TVariables,
  options?: Omit<UseQueryOptions<TData, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData, Error>({
    queryKey: variables ? [...key, variables] : key,
    queryFn: async () => {
      const { data } = await apolloClient.query<TData>({
        query,
        variables,
      })
      return data
    },
    ...options,
  })
}
