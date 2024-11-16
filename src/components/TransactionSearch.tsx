import { useState } from "react"
import { useGraphQLQuery } from '../hooks/useGraphQLQuery';
import { gql } from '@apollo/client';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  MagnifyingGlassIcon,
  CrossCircledIcon,
  PersonIcon,
  DashIcon,
} from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"

const SEARCH_TRANSACTIONS = gql`
  query SearchTransactions($where: TransactionWhereInput, $take: Int) {
    transactions(
      where: $where
      take: $take
    ) {
      hash
      sender
      methodId
      isMessage
      executionResult {
        block {
          height
        }
        status
        statusMessage
      }
    }
  }
`;

interface SearchTransactionsData {
  transactions: Array<{
    hash: string;
    sender: string;
    methodId: string;
    isMessage: boolean;
    createdAt: string;
    executionResult?: {
      block: {
        height: number;
      };
      status: boolean;
      statusMessage: string;
    };
  }>;
}

interface SearchTransactionsVars {
  where: {
    OR?: Array<{
      hash?: { contains: string };
      sender?: { contains: string };
    }>;
  };
  take: number;
}

export function TransactionSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [_, setSelectedTx] = useState<string | null>(null);

  const { data, loading, error } = useGraphQLQuery<
    SearchTransactionsData,
    SearchTransactionsVars
  >(
    ['transactions', 'search', query],
    SEARCH_TRANSACTIONS,
    {
      where: query.length >= 3 ? {
        OR: [
          { hash: { contains: query } },
          { sender: { contains: query } }
        ]
      } : {},
      take: 10
    },
    {
      enabled: query.length >= 3,
      staleTime: 10000,
    }
  ) as any;

  function shortenHash(hash: string): string {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  }

  function getStatusColor(status?: boolean) {
    if (status === undefined) return "bg-yellow-100 text-yellow-800";
    return status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-[300px] justify-start text-muted-foreground"
          aria-label="Search"
        >
          <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
          Search transactions...
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search by transaction hash or sender address..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty className="p-4">
              {loading ? (
                "Searching..."
              ) : error ? (
                <div className="flex items-center gap-2 text-red-500">
                  <CrossCircledIcon />
                  Error searching transactions
                </div>
              ) : query.length < 3 ? (
                "Enter at least 3 characters to search"
              ) : (
                "No transactions found"
              )}
            </CommandEmpty>
            {data?.transactions && (
              <CommandGroup heading="Transactions">
                {data.transactions.map((tx: any) => (
                  <CommandItem
                    key={tx.hash}
                    value={tx.hash}
                    onSelect={() => {
                      setSelectedTx(tx.hash);
                      setOpen(false);
                    }}
                    className="flex flex-col gap-2 p-3 cursor-pointer hover:bg-accent"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <DashIcon className="h-4 w-4" />
                        <span className="font-mono">{shortenHash(tx.hash)}</span>
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs",
                          tx.isMessage
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        )}
                      >
                        {tx.isMessage ? "Message" : "Transaction"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <PersonIcon className="h-4 w-4" />
                        <span className="font-mono">{shortenHash(tx.sender)}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        {tx.executionResult?.block && (
                          <span className="flex items-center gap-1">
                            Block {tx.executionResult.block.height}
                          </span>
                        )}
                      </div>
                    </div>

                    {tx.executionResult && (
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs",
                            getStatusColor(tx.executionResult.status)
                          )}
                        >
                          {tx.executionResult.status ? "Success" : "Failed"}
                        </span>
                        {!tx.executionResult.status && (
                          <span className="text-xs text-muted-foreground">
                            {tx.executionResult.statusMessage}
                          </span>
                        )}
                      </div>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}