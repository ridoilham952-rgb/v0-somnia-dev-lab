# Somnia DevLab SDK Examples

## Real-time Event Monitoring

### Basic Event Streaming

\`\`\`javascript
import { SomniaStream } from 'somnia-devlab'

const stream = new SomniaStream({
  backendUrl: 'http://localhost:8000'
})

async function monitorContract() {
  try {
    // Connect to backend
    await stream.connect()
    console.log('Connected to Somnia DevLab')

    // Subscribe to contract events
    const contractAddress = '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87'
    stream.subscribe(contractAddress)

    // Listen for specific events
    stream.on('Transfer', (event) => {
      console.log(`Transfer: ${event.args[1]} tokens from ${event.args[0]} to ${event.args[1]}`)
    })

    stream.on('Swap', (event) => {
      console.log(`Swap executed in block ${event.blockNumber}`)
    })

    // Listen for all events
    stream.on('event', (event) => {
      console.log(`Event: ${event.eventName} in tx ${event.transactionHash}`)
    })

    // Monitor metrics
    stream.on('metrics', (metrics) => {
      console.log(`TPS: ${metrics.eventsPerSecond}, Errors: ${metrics.errorCount}`)
    })

  } catch (error) {
    console.error('Failed to start monitoring:', error)
  }
}

monitorContract()
\`\`\`

### Advanced Event Filtering

\`\`\`javascript
import { SomniaStream } from 'somnia-devlab'

const stream = new SomniaStream()

await stream.connect()
stream.subscribe('0xYourContractAddress')

// Filter large transfers
stream.on('Transfer', (event) => {
  const amount = BigInt(event.args[2])
  const threshold = BigInt('1000000000000000000000') // 1000 tokens

  if (amount > threshold) {
    console.log(`🚨 Large transfer detected: ${amount.toString()} tokens`)
    // Send alert, log to database, etc.
  }
})

// Monitor failed transactions
stream.on('event', (event) => {
  if (event.gasUsed === '0') {
    console.log(`❌ Failed transaction: ${event.transactionHash}`)
  }
})

// Track gas usage patterns
const gasTracker = {
  total: 0,
  count: 0,
  high: 0
}

stream.on('event', (event) => {
  if (event.gasUsed) {
    const gas = parseInt(event.gasUsed)
    gasTracker.total += gas
    gasTracker.count++
    
    if (gas > 100000) {
      gasTracker.high++
    }
    
    const average = gasTracker.total / gasTracker.count
    console.log(`Average gas: ${average.toFixed(0)}, High gas txs: ${gasTracker.high}`)
  }
})
\`\`\`

## Performance Profiling

### Basic Contract Analysis

\`\`\`javascript
import { SomniaProfiler } from 'somnia-devlab'

const profiler = new SomniaProfiler()

async function analyzeContract() {
  const contractAddress = '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87'
  
  try {
    // Run comprehensive analysis
    const results = await profiler.analyze(contractAddress, 'gas')
    
    console.log(`Optimization Score: ${results.optimizationScore}/100`)
    console.log(`Total Gas Used: ${results.totalGasUsed.toLocaleString()}`)
    
    // Show function rankings
    console.log('\n🔥 Most Expensive Functions:')
    results.functions
      .sort((a, b) => b.gasUsed - a.gasUsed)
      .slice(0, 5)
      .forEach((func, index) => {
        console.log(`${index + 1}. ${func.name}: ${func.gasUsed.toLocaleString()} gas`)
      })
    
    // Show optimization suggestions
    console.log('\n💡 Optimization Suggestions:')
    results.suggestions.forEach(suggestion => {
      const icon = suggestion.type === 'error' ? '🚨' : suggestion.type === 'warning' ? '⚠️' : 'ℹ️'
      console.log(`${icon} ${suggestion.message}`)
    })
    
  } catch (error) {
    console.error('Analysis failed:', error)
  }
}

analyzeContract()
\`\`\`

### Function-Level Optimization

\`\`\`javascript
import { SomniaProfiler } from 'somnia-devlab'

const profiler = new SomniaProfiler()

async function optimizeFunctions() {
  const contractAddress = '0xYourContractAddress'
  
  // Get detailed function metrics
  const functions = await profiler.getFunctionMetrics(contractAddress)
  
  // Find inefficient functions
  const inefficient = functions.filter(func => func.averageGas > 50000)
  
  console.log('🐌 Functions that need optimization:')
  inefficient.forEach(func => {
    console.log(`- ${func.name}: ${func.averageGas.toLocaleString()} avg gas (${func.callCount} calls)`)
  })
  
  // Compare before and after optimization
  const beforeResults = await profiler.analyze(contractAddress)
  
  // ... deploy optimized contract ...
  
  const afterResults = await profiler.analyze(optimizedContractAddress)
  
  const improvement = afterResults.optimizationScore - beforeResults.optimizationScore
  console.log(`Optimization improved score by ${improvement} points`)
}
\`\`\`

## Chaos Testing

### Load Testing

\`\`\`javascript
import { SomniaChaos } from 'somnia-devlab'

const chaos = new SomniaChaos()

async function loadTest() {
  const contractAddress = '0xYourContractAddress'
  
  try {
    // Start a load test
    const testId = await chaos.startTest(contractAddress, 'load', {
      duration: 300, // 5 minutes
      intensity: 60, // 60% intensity
      concurrent: 25, // 25 concurrent transactions
      transactionType: 'transfer'
    })
    
    console.log(`Load test started: ${testId}`)
    
    // Monitor progress
    const monitorInterval = setInterval(async () => {
      const status = await chaos.getTestStatus(testId)
      
      console.log(`Progress: ${status.progress.toFixed(1)}%`)
      console.log(`TPS: ${status.metrics.maxTPS}`)
      console.log(`Success Rate: ${status.metrics.successRate.toFixed(1)}%`)
      console.log(`Errors: ${status.metrics.errorsEncountered}`)
      
      if (status.status === 'completed') {
        clearInterval(monitorInterval)
        console.log('✅ Load test completed!')
        
        // Get final results
        const results = await chaos.getTestResults(testId)
        console.log('Final Results:', results)
      }
    }, 5000)
    
  } catch (error) {
    console.error('Load test failed:', error)
  }
}

loadTest()
\`\`\`

### Security Attack Simulation

\`\`\`javascript
import { SomniaChaos } from 'somnia-devlab'

const chaos = new SomniaChaos()

async function securityTest() {
  const contractAddress = '0xYourContractAddress'
  
  // Run comprehensive attack simulation
  const testId = await chaos.attackSimulation(contractAddress)
  
  console.log('🔒 Running security attack simulation...')
  
  // Wait for completion
  let status
  do {
    await new Promise(resolve => setTimeout(resolve, 10000)) // Wait 10 seconds
    status = await chaos.getTestStatus(testId)
    
    console.log(`Progress: ${status.progress}%`)
    
    if (status.metrics.errorsEncountered > 0) {
      console.log(`⚠️ ${status.metrics.errorsEncountered} potential vulnerabilities found`)
    }
    
  } while (status.status === 'running')
  
  // Analyze results
  const results = await chaos.getTestResults(testId)
  
  if (results.vulnerabilities && results.vulnerabilities.length > 0) {
    console.log('🚨 Security Issues Found:')
    results.vulnerabilities.forEach(vuln => {
      console.log(`- ${vuln.type}: ${vuln.description}`)
    })
  } else {
    console.log('✅ No security vulnerabilities detected')
  }
}

securityTest()
\`\`\`

## Blockchain Replay

### Historical Analysis

\`\`\`javascript
import { SomniaReplay } from 'somnia-devlab'

const replay = new SomniaReplay()

async function analyzeHistory() {
  const contractAddress = '0xYourContractAddress'
  const startBlock = 1000000
  const endBlock = 1001000
  
  // Get blocks in range
  const blocks = await replay.getBlocks(startBlock, endBlock)
  console.log(`Analyzing ${blocks.length} blocks...`)
  
  // Get events in time range
  const startTime = new Date('2024-01-01')
  const endTime = new Date('2024-01-02')
  const events = await replay.getEventsInTimeRange(contractAddress, startTime, endTime)
  
  // Analyze event patterns
  const eventCounts = {}
  events.forEach(event => {
    eventCounts[event.eventName] = (eventCounts[event.eventName] || 0) + 1
  })
  
  console.log('Event Distribution:')
  Object.entries(eventCounts).forEach(([event, count]) => {
    console.log(`${event}: ${count}`)
  })
  
  // Find the most active blocks
  const blockActivity = {}
  events.forEach(event => {
    blockActivity[event.blockNumber] = (blockActivity[event.blockNumber] || 0) + 1
  })
  
  const mostActive = Object.entries(blockActivity)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
  
  console.log('Most Active Blocks:')
  mostActive.forEach(([block, count]) => {
    console.log(`Block ${block}: ${count} events`)
  })
}

analyzeHistory()
\`\`\`

### State Debugging

\`\`\`javascript
import { SomniaReplay } from 'somnia-devlab'

const replay = new SomniaReplay()

async function debugStateChange() {
  const contractAddress = '0xYourContractAddress'
  const problemBlock = 1000500
  
  // Get state before and after
  const stateBefore = await replay.getContractState(contractAddress, problemBlock - 1)
  const stateAfter = await replay.getContractState(contractAddress, problemBlock)
  
  console.log('State Before:', stateBefore)
  console.log('State After:', stateAfter)
  
  // Get the diff
  const diff = await replay.getStateDiff(contractAddress, problemBlock - 1, problemBlock)
  
  console.log('State Changes:')
  Object.entries(diff.changes).forEach(([key, change]) => {
    console.log(`${key}: ${change.from} → ${change.to}`)
  })
  
  // Get events in that block to understand what caused the change
  const blockEvents = await replay.getEventsInTimeRange(
    contractAddress,
    new Date(stateAfter.timestamp),
    new Date(stateAfter.timestamp)
  )
  
  console.log('Events in block:')
  blockEvents.forEach(event => {
    console.log(`- ${event.eventName}: ${JSON.stringify(event.args)}`)
  })
}

debugStateChange()
\`\`\`

## Complete Monitoring Dashboard

\`\`\`javascript
import { SomniaStream, SomniaProfiler, SomniaChaos } from 'somnia-devlab'

class ContractMonitor {
  constructor(contractAddress) {
    this.contractAddress = contractAddress
    this.stream = new SomniaStream()
    this.profiler = new SomniaProfiler()
    this.chaos = new SomniaChaos()
    
    this.metrics = {
      events: 0,
      errors: 0,
      gasUsed: 0,
      lastActivity: null
    }
  }
  
  async start() {
    // Start real-time monitoring
    await this.stream.connect()
    this.stream.subscribe(this.contractAddress)
    
    // Set up event handlers
    this.stream.on('event', (event) => {
      this.metrics.events++
      this.metrics.gasUsed += parseInt(event.gasUsed || '0')
      this.metrics.lastActivity = new Date()
      
      this.logEvent(event)
    })
    
    this.stream.on('metrics', (metrics) => {
      this.updateDashboard(metrics)
    })
    
    // Run initial analysis
    await this.runAnalysis()
    
    // Schedule periodic health checks
    setInterval(() => this.healthCheck(), 300000) // Every 5 minutes
  }
  
  async runAnalysis() {
    try {
      const results = await this.profiler.analyze(this.contractAddress)
      console.log(`📊 Analysis Complete - Score: ${results.optimizationScore}/100`)
      
      if (results.optimizationScore < 70) {
        console.log('⚠️ Contract needs optimization')
        await this.runLoadTest()
      }
    } catch (error) {
      console.error('Analysis failed:', error)
    }
  }
  
  async runLoadTest() {
    console.log('🧪 Running load test...')
    const testId = await this.chaos.quickLoadTest(this.contractAddress, 60)
    
    // Monitor test
    const checkTest = async () => {
      const status = await this.chaos.getTestStatus(testId)
      if (status.status === 'completed') {
        console.log(`✅ Load test completed - Success rate: ${status.metrics.successRate}%`)
      } else {
        setTimeout(checkTest, 10000)
      }
    }
    
    checkTest()
  }
  
  logEvent(event) {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] ${event.eventName} - Gas: ${event.gasUsed}`)
  }
  
  updateDashboard(metrics) {
    console.clear()
    console.log('=== Somnia DevLab Dashboard ===')
    console.log(`Contract: ${this.contractAddress}`)
    console.log(`Events: ${this.metrics.events}`)
    console.log(`TPS: ${metrics.eventsPerSecond}`)
    console.log(`Errors: ${this.metrics.errors}`)
    console.log(`Total Gas: ${this.metrics.gasUsed.toLocaleString()}`)
    console.log(`Last Activity: ${this.metrics.lastActivity}`)
    console.log('===============================')
  }
  
  async healthCheck() {
    console.log('🏥 Running health check...')
    
    // Check if contract is responsive
    try {
      const recentEvents = await this.stream.getRecentEvents(10)
      if (recentEvents.length === 0) {
        console.log('⚠️ No recent activity detected')
      }
    } catch (error) {
      console.error('❌ Health check failed:', error)
    }
  }
}

// Usage
const monitor = new ContractMonitor('0xYourContractAddress')
monitor.start()
\`\`\`

## Error Handling Best Practices

\`\`\`javascript
import { SomniaStream, SomniaProfiler } from 'somnia-devlab'

// Robust error handling
async function robustMonitoring() {
  const stream = new SomniaStream({
    autoReconnect: true,
    maxReconnectAttempts: 10
  })
  
  try {
    await stream.connect()
  } catch (error) {
    console.error('Initial connection failed:', error)
    return
  }
  
  // Handle connection errors
  stream.on('error', (error) => {
    console.error('Stream error:', error)
    // Implement fallback logic
  })
  
  stream.on('disconnected', () => {
    console.log('Disconnected - will attempt to reconnect')
  })
  
  stream.on('connected', () => {
    console.log('Reconnected successfully')
  })
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('Shutting down gracefully...')
    stream.disconnect()
    process.exit(0)
  })
}
