export interface StreamOptions {
  backendUrl?: string
  autoReconnect?: boolean
  reconnectDelay?: number
  maxReconnectAttempts?: number
}

export interface ProfilerOptions {
  backendUrl?: string
}

export interface ChaosOptions {
  backendUrl?: string
}

export interface ReplayOptions {
  backendUrl?: string
}

export interface ContractEvent {
  id: string
  contractAddress: string
  eventName: string
  blockNumber: number
  transactionHash: string
  args: any[]
  gasUsed: string
  timestamp: string
}

export interface Block {
  blockNumber: number
  timestamp: string
  transactionCount: number
  gasUsed: string
  gasLimit: string
}

export interface ConnectionStatus {
  connected: boolean
  contractAddress: string | null
}

export interface FunctionProfile {
  name: string
  gasUsed: number
  executionTime: number
  callCount: number
  averageGas: number
}

export interface ProfileResult {
  contractAddress: string
  functions: FunctionProfile[]
  totalGasUsed: number
  totalExecutionTime: number
  optimizationScore: number
  suggestions: Array<{
    type: "warning" | "error" | "info"
    message: string
    function?: string
  }>
}

export interface TestConfig {
  duration?: number
  intensity?: number
  concurrent?: number
  transactionType?: string
  gasLimit?: number
  enableReentrancy?: boolean
  enableOverflow?: boolean
  enableDOS?: boolean
}

export interface ChaosTest {
  id: string
  type: "load" | "attack" | "stress"
  status: "idle" | "running" | "completed" | "failed"
  progress: number
  startTime?: Date
  endTime?: Date
  metrics: {
    transactionsSent: number
    successRate: number
    averageGasUsed: number
    errorsEncountered: number
    maxTPS: number
    averageLatency: number
  }
}
