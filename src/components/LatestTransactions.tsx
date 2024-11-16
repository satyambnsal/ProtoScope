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
import { useState } from 'react';
import { Transaction } from '@/types';
import TransactionDetailsModal from './TransactionDetailsModal';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { CopyButton } from './CopyButton';

const PAGE_SIZE = 10;

export function LatestTransactions() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error } = useGraphQLQuery<
    GetLatestTransactionsData,
    GetLatestTransactionsVars
  >(
    ['transactions', 'latest', String(currentPage)],
    GET_LATEST_TRANSACTIONS,
    {
      take: PAGE_SIZE,
      skip: (currentPage - 1) * PAGE_SIZE
    },
    {
      refetchInterval: 5000,
    }
  );

  function formatMethodId(methodId: string): string {
    return methodId.replace(/^0x/, '').toUpperCase();
  }

  function shortenHash(hash: string): string {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  }

  // Calculate total pages
  const totalTransactions = 10000;
  const totalPages = Math.ceil(totalTransactions / PAGE_SIZE);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show pages with ellipsis
      if (currentPage <= 3) {
        // Start of pagination
        for (let i = 1; i <= 4; i++) pageNumbers.push(i);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // End of pagination
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pageNumbers.push(i);
      } else {
        // Middle of pagination
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pageNumbers.push(i);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Latest Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hash</TableHead>
                <TableHead>Block No</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(PAGE_SIZE)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground h-32"
                  >
                    Error loading transactions
                  </TableCell>
                </TableRow>
              ) : !data?.transactions.length ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground h-32"
                  >
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                data.transactions.map((tx) => (
                  <TableRow key={tx.hash}>
                    <TableCell className="font-mono">
                      {shortenHash(tx.hash)}
                      <CopyButton value={tx.hash} />
                    </TableCell>
                    <TableCell>
                      {tx.executionResult?.block.height ?? 'Pending'}
                    </TableCell>
                    <TableCell>
                      {formatMethodId(tx.methodId)}
                      <CopyButton value={tx.methodId} />
                    </TableCell>
                    <TableCell className="font-mono">
                      {shortenHash(tx.sender)}
                      <CopyButton value={tx.sender} />
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${tx.isMessage
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                        }`}>
                        {tx.isMessage ? 'Message' : 'Transaction'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="rounded-md" onClick={() => {
                        setSelectedTx(tx);
                        setIsModalOpen(true);
                      }}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {!isLoading && !error && totalPages > 1 && (
            <div className="border-t">
              <Pagination className="py-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {getPageNumbers().map((pageNum, index) => (
                    <PaginationItem key={index}>
                      {pageNum === '...' ? (
                        <span className="px-4 py-2">...</span>
                      ) : (
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(Number(pageNum));
                          }}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>

        {selectedTx && <TransactionDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          transaction={selectedTx}
        />}
      </CardContent>
    </Card>
  );
}