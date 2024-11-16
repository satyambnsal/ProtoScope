import { useGraphQLQuery } from './useGraphQLQuery'
import { GET_NODE_INFO, NodeInfo } from '../graphql/queries/node'

export function useNodeInfo() {
  return useGraphQLQuery<NodeInfo>(['node', 'info'], GET_NODE_INFO, {
    staleTime: 1000,
    cacheTime: 60000,
    refetchInterval: 2000,
    // Continue polling when window is in background
    refetchIntervalInBackground: true,
    // Show previous data while fetching
    keepPreviousData: true,
    // Retry failed requests
    retry: true,
    retryDelay: 1000,
  })
}
