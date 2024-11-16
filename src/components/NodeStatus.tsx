import { useNodeInfo } from '../hooks/useNodeInfo'

export function NodeStatus() {
  const { data, isLoading, error } = useNodeInfo()

  if (isLoading) {
    return (
      <div className="animate-pulse flex space-x-4 p-4">
        <div className="rounded-xl bg-slate-200 h-6 w-28"></div>
        <div className="rounded-xl bg-slate-200 h-6 w-28"></div>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 p-4">Failed to load node status</div>
  }

  return (
    <div className="flex items-center space-x-4 p-4">
      <div className="flex items-center space-x-2">
        <span className="text-gray-500">Block Height:</span>
        <span className="font-mono font-medium">{data?.node.blockHeight}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-gray-500">Batch Height:</span>
        <span className="font-mono font-medium">{data?.node.batchHeight}</span>
      </div>
    </div>
  )
}
