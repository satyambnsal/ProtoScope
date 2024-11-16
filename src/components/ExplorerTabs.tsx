import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LatestTransactions } from "@/components/LatestTransactions"
import { RecentBlocks } from "@/components/RecentBlocks"
import {
  LayersIcon,
  ArrowRightIcon,
  ActivityLogIcon,
  MixerHorizontalIcon,
  GearIcon,
} from "@radix-ui/react-icons"
import { TransactionSearch } from "./TransactionSearch"

export function ExplorerTabs() {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ActivityLogIcon className="h-6 w-6" />
            ProtoScope Explorer
          </h2>
          <p className="text-muted-foreground">
            Browse and search through blocks, transactions, and network activity
          </p>
        </div>
      </div>
      <Tabs defaultValue="transactions" className="space-y-4">
        <div className="border-b">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="transactions" className="flex items-center gap-2">
                <ArrowRightIcon className="h-4 w-4" />
                Transactions
              </TabsTrigger>
              <TabsTrigger value="blocks" className="flex items-center gap-2">
                <LayersIcon className="h-4 w-4" />
                Blocks
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <MixerHorizontalIcon className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>
            {/* <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              <GearIcon className="mr-2 h-4 w-4" />
              Settings
            </button> */}
            <TransactionSearch />
          </div>
        </div>
        <TabsContent value="transactions" className="space-y-4">
          <LatestTransactions />
        </TabsContent>
        <TabsContent value="blocks" className="space-y-4">
          <RecentBlocks />
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="rounded-lg border h-[400px] flex items-center justify-center text-muted-foreground">
            Analytics coming soon
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}