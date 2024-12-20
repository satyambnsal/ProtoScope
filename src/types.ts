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
    stateTransitions: JSON
    status: boolean
  }
}

export interface GetLatestTransactionsData {
  transactions: Transaction[]
}

export interface GetLatestTransactionsVars {
  take: number
  skip?: number
}

export interface Block {
  hash: string
  height: number
  createdAt: string
  producer: string
  stateRoot: string
  _count: {
    transactions: number
  }
  transactions: {
    txHash: string
    events: JSON
    status: boolean
    stateTransitions: JSON
    tx: {
      hash: string
      nonce: number
      sender: string
    }
  }[]
  parentHash: string
  stateTransitions: string
}
