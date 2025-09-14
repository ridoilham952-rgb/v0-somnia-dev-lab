/**
 * Format gas values for display
 */
export function formatGas(gas: string | number): string {
  const gasNum = typeof gas === "string" ? Number.parseInt(gas) : gas
  return gasNum.toLocaleString()
}

/**
 * Format addresses for display
 */
export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/**
 * Format timestamps
 */
export function formatTimestamp(timestamp: string | Date): string {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp
  return date.toLocaleString()
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  return total === 0 ? 0 : (value / total) * 100
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Convert wei to ether
 */
export function weiToEther(wei: string | number): number {
  const weiNum = typeof wei === "string" ? BigInt(wei) : BigInt(wei)
  return Number(weiNum) / 1e18
}

/**
 * Convert ether to wei
 */
export function etherToWei(ether: number): string {
  return BigInt(Math.floor(ether * 1e18)).toString()
}

/**
 * Sleep utility for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
