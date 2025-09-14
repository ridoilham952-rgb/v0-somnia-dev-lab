const express = require("express")
const database = require("../services/database")
const eventListener = require("../services/eventListener")
const logger = require("../utils/logger")

const router = express.Router()

// Get recent events for a contract
router.get("/events/:contractAddress", async (req, res) => {
  try {
    const { contractAddress } = req.params
    const { limit = 50, startTime, endTime } = req.query

    let events
    if (startTime && endTime) {
      events = await database.getEventsByTimeRange(contractAddress, new Date(startTime), new Date(endTime))
    } else {
      events = await database.getRecentEvents(contractAddress, Number.parseInt(limit))
    }

    res.json({ events })
  } catch (error) {
    logger.error("Error fetching events:", error)
    res.status(500).json({ error: "Failed to fetch events" })
  }
})

// Get blocks in a range
router.get("/blocks", async (req, res) => {
  try {
    const { startBlock, endBlock } = req.query

    if (!startBlock || !endBlock) {
      return res.status(400).json({ error: "startBlock and endBlock are required" })
    }

    const blocks = await database.getBlocksByRange(Number.parseInt(startBlock), Number.parseInt(endBlock))

    res.json({ blocks })
  } catch (error) {
    logger.error("Error fetching blocks:", error)
    res.status(500).json({ error: "Failed to fetch blocks" })
  }
})

// Get contract metrics
router.get("/metrics/:contractAddress", async (req, res) => {
  try {
    const { contractAddress } = req.params
    const { timeRange = "1h" } = req.query

    const metrics = await database.getMetrics(contractAddress, timeRange)
    const systemMetrics = eventListener.getMetrics()

    res.json({
      contractMetrics: metrics,
      systemMetrics,
    })
  } catch (error) {
    logger.error("Error fetching metrics:", error)
    res.status(500).json({ error: "Failed to fetch metrics" })
  }
})

// Add contract to monitoring
router.post("/contracts", async (req, res) => {
  try {
    const { address, abi } = req.body

    if (!address || !abi) {
      return res.status(400).json({ error: "address and abi are required" })
    }

    const success = await eventListener.addContract(address, abi)

    if (success) {
      res.json({ message: "Contract added successfully", address })
    } else {
      res.status(500).json({ error: "Failed to add contract" })
    }
  } catch (error) {
    logger.error("Error adding contract:", error)
    res.status(500).json({ error: "Failed to add contract" })
  }
})

// Get system status
router.get("/status", (req, res) => {
  const metrics = eventListener.getMetrics()
  res.json({
    status: "running",
    uptime: process.uptime(),
    metrics,
    timestamp: new Date().toISOString(),
  })
})

// Chaos mode endpoints
router.post("/chaos/start", async (req, res) => {
  try {
    const { contractAddress, testType, intensity = "medium" } = req.body

    // This would integrate with chaos testing engine
    // For now, return a mock response
    res.json({
      message: "Chaos test started",
      testId: `chaos_${Date.now()}`,
      contractAddress,
      testType,
      intensity,
    })
  } catch (error) {
    logger.error("Error starting chaos test:", error)
    res.status(500).json({ error: "Failed to start chaos test" })
  }
})

router.get("/chaos/:testId/status", (req, res) => {
  const { testId } = req.params

  // Mock chaos test status
  res.json({
    testId,
    status: "running",
    progress: 75,
    metrics: {
      transactionsSent: 750,
      successRate: 98.5,
      averageGasUsed: 21000,
      errorsEncountered: 12,
    },
  })
})

module.exports = router
