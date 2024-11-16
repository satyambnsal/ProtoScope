import { useGraphQLQuery } from './useGraphQLQuery'
import { GET_NODE_INFO, NodeInfo } from '../graphql/queries/node'

export function useNodeInfo() {
  return useGraphQLQuery<NodeInfo>(['node', 'info'], GET_NODE_INFO, undefined, {})
}
