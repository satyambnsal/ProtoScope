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
  UpdateIcon,
  PlusIcon,
  MinusIcon
} from "@radix-ui/react-icons"
import { useState } from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CopyButton } from "./CopyButton"

const formatValue = (value: any) => {
  if (typeof value === 'object' && value !== null) {
    return <JsonTree data={value} />;
  }
  if (typeof value === 'string') {
    return <span className="text-green-600">"{value}"</span>;
  }
  if (typeof value === 'number') {
    return <span className="text-blue-600">{value}</span>;
  }
  if (typeof value === 'boolean') {
    return <span className="text-orange-600">{value.toString()}</span>;
  }
  if (value === null) {
    return <span className="text-gray-500">null</span>;
  }
  return value;
};

function JsonView({ data }: { data: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center gap-1 hover:text-blue-600">
        {isOpen ? <MinusIcon /> : <PlusIcon />}
        <span className="text-sm">
          {Object.keys(data).length} fields
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-x-auto">
        <div className="pl-4 pt-2">
          <JsonTree data={data} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function JsonTree({ data }: { data: any }) {
  return (
    <div className="space-y-1 font-mono text-sm">
      {Object.entries(data).map(([key, value], index) => (
        <div key={index} className="flex items-start gap-2 min-w-fit">
          <span className="text-violet-600 whitespace-nowrap">{key}:</span>
          {typeof value === 'object' && value !== null ? (
            <div className="flex-1 overflow-x-auto">
              <JsonView data={value} />
            </div>
          ) : (
            <span className="break-all">{formatValue(value)}</span>
          )}
        </div>
      ))}
    </div>
  );
}


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
      tx: {
        hash: string;
        methodId: string;
        sender: string;
        isMessage: boolean;
      };
      stateTransitions: any;
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

          {/* ... Overview tab content remains the same ... */}

          <TabsContent value="transactions" className="mt-4">
            <div className="rounded-md border">
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hash</TableHead>
                      <TableHead>Sender</TableHead>
                      <TableHead>State Transitions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {block.transactions.map(({ tx, stateTransitions }) => (
                      <TableRow key={tx.hash}>
                        <TableCell>
                          <div className="flex items-center font-mono">
                            {shortenHash(tx.hash)}
                            <CopyButton value={tx.hash} />
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center font-mono">
                            {shortenHash(tx.sender)}
                            <CopyButton value={tx.sender} />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="py-2">
                            <JsonView data={stateTransitions} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="state" className="mt-4">
            <div className="rounded-md border p-4 text-center text-muted-foreground">
              <UpdateIcon className="h-8 w-8 mx-auto mb-2" />
              <p>State changes summary coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}