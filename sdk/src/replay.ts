import type { ReplayOptions, Block, ContractEvent } from "./types"

export class SomniaReplay {
  private options: ReplayOptions

  constructor(options: ReplayOptions = {}) {
    this.options = {
      backendUrl: "http://localhost:8000",
      ...options,
    }
  }

  /**
   * Get blocks in a specific range
   */
  async getBlocks(startBlock: number, endBlock: number): Promise<Block[]> {
    const response = await fetch(`${this.options.backendUrl}/api/blocks?startBlock=${startBlock}&endBlock=${endBlock}`)

    if (!response.ok) {
      throw new Error(`Failed to get blocks: ${response.statusText}`)
    }

    const data = await response.json()
    return data.blocks
  }

  /**
   * Get events for a contract in a time range
   */
  async getEventsInTimeRange(contractAddress: string, startTime: Date, endTime: Date): Promise<ContractEvent[]> {
    const response = await fetch(
      `${this.options.backendUrl}/api/events/${contractAddress}?startTime=${startTime.toISOString()}&endTime=${endTime.toISOString()}`,
    )

    if (!response.ok) {
      throw new Error(`Failed to get events: ${response.statusText}`)
    }

    const data = await response.json()
    return data.events
  }

  /**
   * Get contract state at a specific block
   */
  async getContractState(contractAddress: string, blockNumber: number): Promise<any> {
    const response = await fetch(`${this.options.backendUrl}/api/replay/state/${contractAddress}/${blockNumber}`)

    if (!response.ok) {
      throw new Error(`Failed to get contract state: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get state diff between two blocks
   */
  async getStateDiff(contractAddress: string, fromBlock: number, toBlock: number): Promise<any> {
    const response = await fetch(
      `${this.options.backendUrl}/api/replay/diff/${contractAddress}?from=${fromBlock}&to=${toBlock}`,
    )

    if (!response.ok) {
      throw new Error(`Failed to get state diff: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Create a replay session
   */
  async createSession(contractAddress: string, startBlock: number, endBlock: number): Promise<string> {
    const response = await fetch(`${this.options.backendUrl}/api/replay/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contractAddress,
        startBlock,
        endBlock,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to create replay session: ${response.statusText}`)
    }

    const data = await response.json()
    return data.sessionId
  }
}
