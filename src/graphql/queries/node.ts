import { gql } from '@apollo/client'

export const GET_NODE_INFO = gql`
  query GetNodeInfo {
    node {
      blockHeight
      batchHeight
    }
  }
`

// Define types for the query response
export interface NodeInfo {
  node: {
    blockHeight: number
    batchHeight: number
  }
}

// src/hooks/useNodeInfo.ts

// Example usage in a component:
// src/components/NodeStatus.tsx
