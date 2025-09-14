const { ethers } = require("ethers")
const database = require("./database")
const logger = require("../utils/logger")

class EventListener {
  constructor() {
    this.provider = null
    this.contracts = new Map()
    this.io = null
    this.metrics = {
      totalEvents: 0,
      eventsPerSecond: 0,
      errorCount: 0,
      lastEventTime: null,
    }
    this.metricsInterval = null
  }

  async start(io) {
    this.io = io

    try {
      // Connect to Somnia Network
      this.provider = new ethers.JsonRpcProvider(process.env.SOMNIA_RPC_URL || "https://rpc.somnia.network")

      logger.info("Connected to Somnia Network")

      // Start metrics tracking
      this.startMetricsTracking()

      // Listen for new blocks
      this.provider.on("block", (blockNumber) => {
        this.handleNewBlock(blockNumber)
      })
    } catch (error) {
      logger.error("Failed to start event listener:", error)
      throw error
    }
  }

  async addContract(contractAddress, abi) {
    try {
      const contract = new ethers.Contract(contractAddress, abi, this.provider)
      this.contracts.set(contractAddress, contract)

      // Listen to all events for this contract
      contract.on("*", (event) => {
        this.handleEvent(contractAddress, event)
      })

      logger.info(`Added contract listener: ${contractAddress}`)
      return true
    } catch (error) {
      logger.error(`Failed to add contract ${contractAddress}:`, error)
      return false
    }
  }

  async handleEvent(contractAddress, event) {
    try {
      const eventData = {
        contractAddress,
        eventName: event.event || "Unknown",
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
        args: event.args ? Object.values(event.args) : [],
        timestamp: new Date(),
        gasUsed: null, // Will be filled by transaction receipt
      }

      // Get transaction receipt for gas data
      if (event.transactionHash) {
        try {
          const receipt = await this.provider.getTransactionReceipt(event.transactionHash)
          eventData.gasUsed = receipt.gasUsed.toString()
        } catch (receiptError) {
          logger.warn(`Failed to get receipt for ${event.transactionHash}`)
        }
      }

      // Store in database
      await database.storeEvent(eventData)

      // Emit to connected clients
      this.io.to(`contract:${contractAddress}`).emit("new-event", eventData)

      // Update metrics
      this.metrics.totalEvents++
      this.metrics.lastEventTime = new Date()

      logger.debug(`Event processed: ${eventData.eventName} from ${contractAddress}`)
    } catch (error) {
      this.metrics.errorCount++
      logger.error("Error handling event:", error)
    }
  }

  async handleNewBlock(blockNumber) {
    try {
      const block = await this.provider.getBlock(blockNumber)

      const blockData = {
        blockNumber,
        timestamp: new Date(block.timestamp * 1000),
        transactionCount: block.transactions.length,
        gasUsed: block.gasUsed.toString(),
        gasLimit: block.gasLimit.toString(),
      }

      // Store block data
      await database.storeBlock(blockData)

      // Emit block data to all clients
      this.io.emit("new-block", blockData)

      logger.debug(`New block processed: ${blockNumber}`)
    } catch (error) {
      logger.error(`Error processing block ${blockNumber}:`, error)
    }
  }

  startMetricsTracking() {
    let lastEventCount = 0

    this.metricsInterval = setInterval(() => {
      const currentEventCount = this.metrics.totalEvents
      this.metrics.eventsPerSecond = currentEventCount - lastEventCount
      lastEventCount = currentEventCount

      // Emit metrics to all clients
      this.io.emit("metrics-update", {
        ...this.metrics,
        timestamp: new Date(),
      })
    }, 1000) // Update every second
  }

  getMetrics() {
    return this.metrics
  }

  stop() {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval)
    }

    if (this.provider) {
      this.provider.removeAllListeners()
    }

    this.contracts.clear()
    logger.info("Event listener stopped")
  }
}

module.exports = new EventListener()
