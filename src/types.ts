export interface Transaction {
  hash: string
  methodId: string
  sender: string
  nonce: string
  isMessage: boolean
  executionResult?: {
    block: {
      height: number
      hash: string
      batchHeight?: number
    }
  }
}

export interface GetLatestTransactionsData {
  transactions: Transaction[]
}

export interface GetLatestTransactionsVars {
  take: number
  skip?: number
}
