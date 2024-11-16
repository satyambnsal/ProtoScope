import { gql } from '@apollo/client'

export const GET_LATEST_TRANSACTIONS = gql`
  query GetLatestTransactions($take: Int!, $skip: Int) {
    transactions(
      orderBy: [{ executionResult: { block: { height: desc } } }]
      take: $take
      skip: $skip
    ) {
      hash
      methodId
      sender
      nonce
      isMessage
      executionResult {
        block {
          height
          hash
          batchHeight
        }
      }
    }
  }
`
