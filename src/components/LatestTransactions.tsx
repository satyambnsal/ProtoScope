import { useGraphQLQuery } from '../hooks/useGraphQLQuery';
import {
  GET_LATEST_TRANSACTIONS,
} from '../graphql/queries/transactions';
import {
  GetLatestTransactionsData,
  GetLatestTransactionsVars
} from '@/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistance } from 'date-fns';
import { useState } from 'react';
import { Transaction } from '@/types';
import TransactionDetailsModal from './TransactionDetailsModal';

const PAGE_SIZE = 10;

export function LatestTransactions() {
  const { data, isLoading, error } = useGraphQLQuery<
    GetLatestTransactionsData,
    GetLatestTransactionsVars
  >(
    ['transactions', 'latest'],
    GET_LATEST_TRANSACTIONS,
    { take: PAGE_SIZE },
    {
      refetchInterval: 5000, // Refresh every 5 seconds
    }
  );
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  function formatMethodId(methodId: string): string {
    // Convert the method ID to a readable format
    // This might need adjustment based on your actual method ID format
    return methodId.replace(/^0x/, '').toUpperCase();
  }

  function shortenHash(hash: string): string {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Latest Transactions</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hash</TableHead>
                <TableHead>Block</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading state
                [...Array(PAGE_SIZE)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground h-32"
                  >
                    Error loading transactions
                  </TableCell>
                </TableRow>
              ) : !data?.transactions.length ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground h-32"
                  >
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                data.transactions.map((tx) => (
                  <TableRow key={tx.hash} onClick={() => {
                    setSelectedTx(tx);
                    setIsModalOpen(true);
                  }}>
                    <TableCell className="font-mono">
                      {shortenHash(tx.hash)}
                    </TableCell>
                    <TableCell>
                      {tx.executionResult?.block.height ?? 'Pending'}
                    </TableCell>
                    <TableCell>
                      {formatMethodId(tx.methodId)}
                    </TableCell>
                    <TableCell className="font-mono">
                      {shortenHash(tx.sender)}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${tx.isMessage
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                        }`}>
                        {tx.isMessage ? 'Message' : 'Transaction'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {selectedTx && <TransactionDetailsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            transaction={selectedTx}
          />}
        </div>
      </CardContent>
    </Card >
  );
}
