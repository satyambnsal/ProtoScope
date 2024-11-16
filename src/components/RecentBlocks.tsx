import { useGraphQLQuery } from '../hooks/useGraphQLQuery';
import { gql } from '@apollo/client';
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
import { formatDistance } from 'date-fns';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  CopyIcon,
  CheckIcon,
  DashIcon,
  ClockIcon,
  CubeIcon,
  LayersIcon,
  PersonIcon
} from "@radix-ui/react-icons";

import BlockDetailsModal from './BlockDetailsModal';
import { CopyButton } from './CopyButton';

const PAGE_SIZE = 10;

export const GET_RECENT_BLOCKS = gql`
  query GetRecentBlocks($take: Int!, $skip: Int!) {
    blocks(
      take: $take
      skip: $skip
      orderBy: [{ height: desc }]
    ) {
      hash
      height
    transactionsHash
    batchHeight
    parentHash
  _count {
    transactions(where: {status:{
      equals: true
    } })
  }
      transactions {
        txHash
      }
    }
  
  aggregateBlock(take: $take, skip: $skip) {
    _count {
      _all
    }
  }
  }
`;

interface Block {
  hash: string;
  height: number;
  createdAt: string;
  producer: string;
  stateRoot: string;
  _count: {
    transactions: number
  };
  transactions: { hash: string }[];
  parentHash: string
}

interface GetRecentBlocksData {
  blocks: Block[];
  aggregateBlock: {
    _count: {
      _all: number;
    }
  }
}

interface GetRecentBlocksVars {
  take: number;
  skip: number;
}

export function RecentBlocks() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error } = useGraphQLQuery<
    GetRecentBlocksData,
    GetRecentBlocksVars
  >(
    ['blocks', 'recent', String(currentPage)],
    GET_RECENT_BLOCKS,
    {
      take: PAGE_SIZE,
      skip: (currentPage - 1) * PAGE_SIZE
    },
    {
      refetchInterval: 5000,
    }
  );

  function shortenHash(hash: string): string {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  }

  // Calculate total pages
  const totalBlocks = (data?.blocks || [])?.length > 0 ? data?.blocks[0].height || 0 : 0;
  const totalPages = Math.ceil(totalBlocks / PAGE_SIZE);

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
        <CardTitle className="flex items-center gap-2">
          <CubeIcon className="h-5 w-5" />
          Recent Blocks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <LayersIcon className="h-4 w-4" />
                    Block Height
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <DashIcon className="h-4 w-4" />
                    Block Hash
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4" />
                    Total Transactions
                  </div>
                </TableHead>
                <TableHead>Txs</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(PAGE_SIZE)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[40px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground h-32"
                  >
                    Error loading blocks
                  </TableCell>
                </TableRow>
              ) : !data?.blocks.length ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground h-32"
                  >
                    No blocks found
                  </TableCell>
                </TableRow>
              ) : (
                data.blocks.map((block) => (
                  <TableRow key={block.hash}>
                    <TableCell>
                      {block.height}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center font-mono">
                        {shortenHash(block.hash)}
                        <CopyButton value={block.hash} />
                      </div>
                    </TableCell>
                    <TableCell>
                      {block._count.transactions}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center font-mono">
                        {shortenHash(block.parentHash)}
                        <CopyButton value={block.producer} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-md"
                        onClick={() => {
                          setSelectedBlock(block);
                          setIsModalOpen(true);
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

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

        {selectedBlock && (
          <BlockDetailsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            block={selectedBlock}
          />
        )}
      </CardContent>
    </Card>
  );
}