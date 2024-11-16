import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Transaction } from "@/types"
import {
  IdCardIcon,
  PersonIcon,
  ClockIcon,
  ArrowRightIcon,
  InfoCircledIcon,
  EnterIcon,
  ExitIcon,
  CardStackIcon,
  CounterClockwiseClockIcon
} from "@radix-ui/react-icons"

type TransactionDetailsModalProps = {
  isOpen: boolean,
  onClose: () => void
  transaction: Transaction
}

export default function TransactionDetailsModal({ isOpen, onClose, transaction }: TransactionDetailsModalProps) {
  // Preprocess display values
  const txDetails = {
    hash: transaction?.hash || '',
    sender: transaction?.sender || '',
    recipient: transaction?.recipient || '',
    amount: transaction?.amount || '0',
    timestamp: transaction?.timestamp ? new Date(transaction.timestamp).toLocaleString() : '',
    status: transaction?.status || 'Unknown',
    methodId: transaction?.methodId || '',
    nonce: transaction?.nonce || '0'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <InfoCircledIcon className="w-5 h-5" />
            Transaction Details
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium flex items-center gap-2 whitespace-nowrap w-40">
                    <IdCardIcon className="w-4 h-4 shrink-0" />
                    Transaction Hash
                  </TableCell>
                  <TableCell className="font-mono break-all max-w-[400px]">{txDetails.hash}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium flex items-center gap-2 whitespace-nowrap w-40">
                    <ExitIcon className="w-4 h-4 shrink-0" />
                    From
                  </TableCell>
                  <TableCell className="font-mono break-all max-w-[400px]">{txDetails.sender}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium flex items-center gap-2 whitespace-nowrap w-40">
                    <EnterIcon className="w-4 h-4 shrink-0" />
                    To
                  </TableCell>
                  <TableCell className="font-mono break-all max-w-[400px]">{txDetails.recipient}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium flex items-center gap-2 whitespace-nowrap w-40">
                    <ArrowRightIcon className="w-4 h-4 shrink-0" />
                    Amount
                  </TableCell>
                  <TableCell>{txDetails.amount} MINA</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium flex items-center gap-2 whitespace-nowrap w-40">
                    <ClockIcon className="w-4 h-4 shrink-0" />
                    Timestamp
                  </TableCell>
                  <TableCell>{txDetails.timestamp}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium flex items-center gap-2 whitespace-nowrap w-40">
                    <CounterClockwiseClockIcon className="w-4 h-4 shrink-0" />
                    Status
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm ${txDetails.status.toLowerCase() === 'success'
                        ? 'bg-green-100 text-green-800'
                        : txDetails.status.toLowerCase() === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                      {txDetails.status}
                    </span>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium flex items-center gap-2 whitespace-nowrap w-40">
                    <CardStackIcon className="w-4 h-4 shrink-0" />
                    Method ID
                  </TableCell>
                  <TableCell className="font-mono break-all max-w-[400px]">{txDetails.methodId}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium flex items-center gap-2 whitespace-nowrap w-40">
                    <PersonIcon className="w-4 h-4 shrink-0" />
                    Nonce
                  </TableCell>
                  <TableCell>{txDetails.nonce}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}