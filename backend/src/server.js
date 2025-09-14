const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const cors = require("cors")
const helmet = require("helmet")
require("dotenv").config()

const eventListener = require("./services/eventListener")
const database = require("./services/database")
const logger = require("./utils/logger")
const routes = require("./routes")

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())

// Routes
app.use("/api", routes)

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// Initialize database
database
  .init()
  .then(() => {
    logger.info("Database initialized successfully")
  })
  .catch((err) => {
    logger.error("Database initialization failed:", err)
    process.exit(1)
  })

// Socket.IO connection handling
io.on("connection", (socket) => {
  logger.info(`Client connected: ${socket.id}`)

  socket.on("subscribe", (contractAddress) => {
    logger.info(`Client ${socket.id} subscribing to ${contractAddress}`)
    socket.join(`contract:${contractAddress}`)

    // Send recent events
    database.getRecentEvents(contractAddress, 10).then((events) => {
      socket.emit("recent-events", events)
    })
  })

  socket.on("unsubscribe", (contractAddress) => {
    logger.info(`Client ${socket.id} unsubscribing from ${contractAddress}`)
    socket.leave(`contract:${contractAddress}`)
  })

  socket.on("disconnect", () => {
    logger.info(`Client disconnected: ${socket.id}`)
  })
})

// Start event listener
eventListener.start(io)

const PORT = process.env.PORT || 8000
server.listen(PORT, () => {
  logger.info(`Somnia DevLab Backend running on port ${PORT}`)
})

module.exports = { app, server, io }
