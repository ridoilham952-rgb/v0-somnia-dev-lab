# Somnia DevLab SDK API Reference

## Installation

\`\`\`bash
npm install somnia-devlab
\`\`\`

## Quick Start

\`\`\`javascript
import { SomniaStream, SomniaProfiler, SomniaChaos } from 'somnia-devlab'

// Real-time event streaming
const stream = new SomniaStream()
await stream.connect()
stream.subscribe('0xYourContractAddress')

stream.on('Transfer', (event) => {
  console.log('New transfer:', event)
})

// Performance profiling
const profiler = new SomniaProfiler()
const results = await profiler.analyze('0xYourContractAddress', 'gas')
console.log('Optimization score:', results.optimizationScore)

// Chaos testing
const chaos = new SomniaChaos()
const testId = await chaos.quickLoadTest('0xYourContractAddress', 60)
\`\`\`

## SomniaStream

Real-time event streaming and monitoring.

### Constructor

\`\`\`typescript
new SomniaStream(options?: StreamOptions)
\`\`\`

**Options:**
- `backendUrl` (string): Backend server URL (default: 'http://localhost:8000')
- `autoReconnect` (boolean): Auto-reconnect on disconnect (default: true)
- `reconnectDelay` (number): Delay between reconnection attempts in ms (default: 1000)
- `maxReconnectAttempts` (number): Maximum reconnection attempts (default: 5)

### Methods

#### connect()
Connect to the Somnia DevLab backend.

\`\`\`typescript
await stream.connect()
\`\`\`

#### subscribe(contractAddress)
Subscribe to events from a specific contract.

\`\`\`typescript
stream.subscribe('0x742d35Cc6634C0532925a3b8D4C9db96590c6C87')
\`\`\`

#### on(eventName, listener)
Listen for specific events.

\`\`\`typescript
// Listen for specific contract events
stream.on('Transfer', (event) => console.log(event))
stream.on('Swap', (event) => console.log(event))

// Listen for system events
stream.on('connected', () => console.log('Connected'))
stream.on('metrics', (metrics) => console.log(metrics))
stream.on('block', (block) => console.log(block))
\`\`\`

#### getRecentEvents(limit?)
Get recent events for the subscribed contract.

\`\`\`typescript
const events = await stream.getRecentEvents(100)
\`\`\`

#### getMetrics(timeRange?)
Get contract metrics.

\`\`\`typescript
const metrics = await stream.getMetrics('24h') // '1h', '24h', '7d'
\`\`\`

#### disconnect()
Disconnect from the backend.

\`\`\`typescript
stream.disconnect()
\`\`\`

## SomniaProfiler

Smart contract performance analysis and optimization.

### Constructor

\`\`\`typescript
new SomniaProfiler(options?: ProfilerOptions)
\`\`\`

### Methods

#### analyze(contractAddress, analysisType?)
Analyze contract performance.

\`\`\`typescript
const result = await profiler.analyze(
  '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
  'gas' // 'gas', 'performance', 'security'
)

console.log('Optimization score:', result.optimizationScore)
console.log('Functions:', result.functions)
console.log('Suggestions:', result.suggestions)
\`\`\`

#### getFunctionMetrics(contractAddress)
Get function-level performance metrics.

\`\`\`typescript
const functions = await profiler.getFunctionMetrics('0x...')
functions.forEach(func => {
  console.log(`${func.name}: ${func.gasUsed} gas, ${func.callCount} calls`)
})
\`\`\`

#### getOptimizationSuggestions(contractAddress)
Get optimization suggestions.

\`\`\`typescript
const suggestions = await profiler.getOptimizationSuggestions('0x...')
suggestions.forEach(suggestion => {
  console.log(`${suggestion.type}: ${suggestion.message}`)
})
\`\`\`

#### compare(contractA, contractB)
Compare performance between two contracts.

\`\`\`typescript
const comparison = await profiler.compare('0xContractA', '0xContractB')
console.log('Performance difference:', comparison)
\`\`\`

## SomniaChaos

Chaos testing and stress testing for smart contracts.

### Constructor

\`\`\`typescript
new SomniaChaos(options?: ChaosOptions)
\`\`\`

### Methods

#### startTest(contractAddress, testType, config)
Start a chaos test.

\`\`\`typescript
const testId = await chaos.startTest('0x...', 'load', {
  duration: 120,
  intensity: 75,
  concurrent: 20,
  transactionType: 'mixed'
})
\`\`\`

#### quickLoadTest(contractAddress, duration?)
Run a quick load test.

\`\`\`typescript
const testId = await chaos.quickLoadTest('0x...', 60)
\`\`\`

#### stressTest(contractAddress, intensity?)
Run a stress test.

\`\`\`typescript
const testId = await chaos.stressTest('0x...', 80)
\`\`\`

#### attackSimulation(contractAddress)
Run security attack simulation.

\`\`\`typescript
const testId = await chaos.attackSimulation('0x...')
\`\`\`

#### getTestStatus(testId)
Get test status and progress.

\`\`\`typescript
const status = await chaos.getTestStatus(testId)
console.log(`Progress: ${status.progress}%`)
console.log(`TPS: ${status.metrics.maxTPS}`)
\`\`\`

#### stopTest(testId)
Stop a running test.

\`\`\`typescript
await chaos.stopTest(testId)
\`\`\`

## SomniaReplay

Blockchain history replay and state inspection.

### Constructor

\`\`\`typescript
new SomniaReplay(options?: ReplayOptions)
\`\`\`

### Methods

#### getBlocks(startBlock, endBlock)
Get blocks in a specific range.

\`\`\`typescript
const blocks = await replay.getBlocks(1000000, 1000100)
\`\`\`

#### getEventsInTimeRange(contractAddress, startTime, endTime)
Get events in a time range.

\`\`\`typescript
const events = await replay.getEventsInTimeRange(
  '0x...',
  new Date('2024-01-01'),
  new Date('2024-01-02')
)
\`\`\`

#### getContractState(contractAddress, blockNumber)
Get contract state at a specific block.

\`\`\`typescript
const state = await replay.getContractState('0x...', 1000000)
console.log('Balance:', state.balance)
console.log('Total Supply:', state.totalSupply)
\`\`\`

#### getStateDiff(contractAddress, fromBlock, toBlock)
Get state differences between blocks.

\`\`\`typescript
const diff = await replay.getStateDiff('0x...', 1000000, 1000001)
console.log('State changes:', diff)
\`\`\`

## Utility Functions

\`\`\`typescript
import { formatGas, formatAddress, isValidAddress, weiToEther } from 'somnia-devlab'

// Format gas for display
const formatted = formatGas(21000) // "21,000"

// Format address
const short = formatAddress('0x742d35Cc6634C0532925a3b8D4C9db96590c6C87') // "0x742d...6C87"

// Validate address
const valid = isValidAddress('0x742d35Cc6634C0532925a3b8D4C9db96590c6C87') // true

// Convert wei to ether
const ether = weiToEther('1000000000000000000') // 1.0
\`\`\`

## Error Handling

All SDK methods throw errors that should be handled:

\`\`\`typescript
try {
  await stream.connect()
  stream.subscribe('0x...')
} catch (error) {
  console.error('Connection failed:', error.message)
}

try {
  const results = await profiler.analyze('0x...')
} catch (error) {
  console.error('Analysis failed:', error.message)
}
\`\`\`

## TypeScript Support

The SDK is written in TypeScript and includes full type definitions:

\`\`\`typescript
import { ContractEvent, ProfileResult, ChaosTest } from 'somnia-devlab'

stream.on('Transfer', (event: ContractEvent) => {
  // event is fully typed
  console.log(event.eventName, event.args, event.gasUsed)
})
