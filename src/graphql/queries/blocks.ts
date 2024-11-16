import { gql } from '@apollo/client'

export const GET_RECENT_BLOCKS = gql`
  query GetRecentBlocks($take: Int!, $skip: Int!) {
    blocks(take: $take, skip: $skip, orderBy: [{ height: desc }]) {
      hash
      height
      transactionsHash
      batchHeight
      parentHash
      _count {
        transactions(where: { status: { equals: true } })
      }
      transactions {
        txHash
        events
        status
        stateTransitions
        tx {
          hash
          nonce
          sender
        }
      }
    }

    aggregateBlock(take: $take, skip: $skip) {
      _count {
        _all
      }
    }
  }
`
