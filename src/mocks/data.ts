export interface Transaction {
  hash: string
  block: number
  timestamp: string
  from: string
  to: string
  method: string
  status: 'success' | 'failed'
}

const METHODS = ['transfer', 'vote', 'stake', 'unstake', 'claim', 'register'] as const

// Sample of base58-like addresses
const SAMPLE_ADDRESSES = [
  'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEuGjmKx',
  'B62qkRohY8rVLbXX1nYnihC4EPtqm3jiPKEXGfE1s9fFQZCwMRuzZfB',
  'B62qoGvKn3Rvh8HHuDu3SrVE4YZCJqBfhJqpqNGC2TZvB6mG8Zi8TyY',
  'B62qrYyYrCGw41SMf5qQHHHuBwHJkgXbqSE1RQB4crLuC5ZV6zCxMQE',
]

// Generate a random transaction hash
function generateHash(): string {
  return Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
}

// Get random element from array
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

// Generate mock transactions
export const mockTransactions: Transaction[] = Array.from({ length: 20 }, (_, i) => ({
  hash: generateHash(),
  block: 100000 - i,
  timestamp: new Date(Date.now() - i * 1000 * 60).toISOString(),
  from: getRandomElement(SAMPLE_ADDRESSES),
  to: getRandomElement(SAMPLE_ADDRESSES),
  method: getRandomElement(METHODS as any as string[]),
  status: Math.random() > 0.9 ? 'failed' : 'success',
}))
