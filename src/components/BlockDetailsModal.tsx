import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CopyIcon,
  CheckIcon,
  DashIcon,
  ClockIcon,
  CubeIcon,
  LayersIcon,
  PersonIcon,
  FileIcon,
  UpdateIcon
} from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatDistance } from 'date-fns'
import { CopyButton } from "./CopyButton"


interface BlockDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  block: {
    hash: string;
    height: number;
    createdAt: string;
    producer: string;
    stateRoot: string;
    transactions: {
      hash: string;
      methodId: string;
      sender: string;
      isMessage: boolean;
    }[];
  };
}

export default function BlockDetailsModal({ isOpen, onClose, block }: BlockDetailsModalProps) {
  function shortenHash(hash: string): string {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  }

  function formatMethodId(methodId: string): string {
    return methodId.replace(/^0x/, '').toUpperCase();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CubeIcon className="h-5 w-5" />
            Block #{block.height}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">
              Transactions ({block.transactions.length})
            </TabsTrigger>
            <TabsTrigger value="state">State Changes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium flex items-center gap-2 whitespace-nowrap w-40">
                      <LayersIcon className="h-4 w-4 shrink-0" />
                      Height
                    </TableCell>
                    <TableCell>{block.height}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium flex items-center gap-2 whitespace-nowrap w-40">
                      <DashIcon className="h-4 w-4 shrink-0" />
                      Block Hash
                    </TableCell>
                    <TableCell className="font-mono">
                      <div className="flex items-center">
                        {block.hash}
                        <CopyButton value={block.hash} />
                      </div>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium flex items-center gap-2 whitespace-nowrap w-40">
                      <FileIcon className="h-4 w-4 shrink-0" />
                      State Root
                    </TableCell>
                    <TableCell className="font-mono">
                      <div className="flex items-center">
                        {block.stateRoot}
                        <CopyButton value={block.stateRoot} />
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="mt-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hash</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {block.transactions.map((tx) => (
                    <TableRow key={tx.hash}>
                      <TableCell>
                        <div className="flex items-center font-mono">
                          {shortenHash(tx.hash)}
                          <CopyButton value={tx.hash} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {formatMethodId(tx.methodId)}
                          <CopyButton value={tx.methodId} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center font-mono">
                          {shortenHash(tx.sender)}
                          <CopyButton value={tx.sender} />
                        </div>
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
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="state" className="mt-4">
            <div className="rounded-md border p-4 text-center text-muted-foreground">
              <UpdateIcon className="h-8 w-8 mx-auto mb-2" />
              <p>State changes tracking coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}