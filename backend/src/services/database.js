const { Pool } = require("pg")
const logger = require("../utils/logger")

class Database {
  constructor() {
    this.pool = null
  }

  async init() {
    try {
      this.pool = new Pool({
        connectionString: process.env.DATABASE_URL || "postgresql://devlab:password@localhost:5432/somnia_devlab",
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      })

      // Test connection
      await this.pool.query("SELECT NOW()")

      // Create tables
      await this.createTables()

      logger.info("Database connection established")
    } catch (error) {
      logger.error("Database initialization failed:", error)
      throw error
    }
  }

  async createTables() {
    const queries = [
      `CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        contract_address VARCHAR(42) NOT NULL,
        event_name VARCHAR(100) NOT NULL,
        block_number BIGINT NOT NULL,
        transaction_hash VARCHAR(66),
        args JSONB,
        gas_used BIGINT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS blocks (
        block_number BIGINT PRIMARY KEY,
        timestamp TIMESTAMP NOT NULL,
        transaction_count INTEGER NOT NULL,
        gas_used BIGINT NOT NULL,
        gas_limit BIGINT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS transactions (
        hash VARCHAR(66) PRIMARY KEY,
        block_number BIGINT NOT NULL,
        from_address VARCHAR(42) NOT NULL,
        to_address VARCHAR(42),
        value BIGINT NOT NULL,
        gas_used BIGINT NOT NULL,
        gas_price BIGINT NOT NULL,
        status INTEGER NOT NULL,
        timestamp TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS contract_states (
        id SERIAL PRIMARY KEY,
        contract_address VARCHAR(42) NOT NULL,
        block_number BIGINT NOT NULL,
        state_data JSONB NOT NULL,
        timestamp TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      // Indexes for performance
      `CREATE INDEX IF NOT EXISTS idx_events_contract_block ON events(contract_address, block_number)`,
      `CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp)`,
      `CREATE INDEX IF NOT EXISTS idx_blocks_timestamp ON blocks(timestamp)`,
      `CREATE INDEX IF NOT EXISTS idx_transactions_block ON transactions(block_number)`,
      `CREATE INDEX IF NOT EXISTS idx_contract_states_contract_block ON contract_states(contract_address, block_number)`,
    ]

    for (const query of queries) {
      await this.pool.query(query)
    }

    logger.info("Database tables created/verified")
  }

  async storeEvent(eventData) {
    const query = `
      INSERT INTO events (contract_address, event_name, block_number, transaction_hash, args, gas_used, timestamp)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `

    const values = [
      eventData.contractAddress,
      eventData.eventName,
      eventData.blockNumber,
      eventData.transactionHash,
      JSON.stringify(eventData.args),
      eventData.gasUsed,
      eventData.timestamp,
    ]

    const result = await this.pool.query(query, values)
    return result.rows[0].id
  }

  async storeBlock(blockData) {
    const query = `
      INSERT INTO blocks (block_number, timestamp, transaction_count, gas_used, gas_limit)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (block_number) DO UPDATE SET
        timestamp = EXCLUDED.timestamp,
        transaction_count = EXCLUDED.transaction_count,
        gas_used = EXCLUDED.gas_used,
        gas_limit = EXCLUDED.gas_limit
    `

    const values = [
      blockData.blockNumber,
      blockData.timestamp,
      blockData.transactionCount,
      blockData.gasUsed,
      blockData.gasLimit,
    ]

    await this.pool.query(query, values)
  }

  async getRecentEvents(contractAddress, limit = 50) {
    const query = `
      SELECT * FROM events 
      WHERE contract_address = $1 
      ORDER BY timestamp DESC 
      LIMIT $2
    `

    const result = await this.pool.query(query, [contractAddress, limit])
    return result.rows
  }

  async getEventsByTimeRange(contractAddress, startTime, endTime) {
    const query = `
      SELECT * FROM events 
      WHERE contract_address = $1 
        AND timestamp BETWEEN $2 AND $3
      ORDER BY timestamp ASC
    `

    const result = await this.pool.query(query, [contractAddress, startTime, endTime])
    return result.rows
  }

  async getBlocksByRange(startBlock, endBlock) {
    const query = `
      SELECT * FROM blocks 
      WHERE block_number BETWEEN $1 AND $2
      ORDER BY block_number ASC
    `

    const result = await this.pool.query(query, [startBlock, endBlock])
    return result.rows
  }

  async getMetrics(contractAddress, timeRange = "1h") {
    const timeCondition =
      {
        "1h": "timestamp > NOW() - INTERVAL '1 hour'",
        "24h": "timestamp > NOW() - INTERVAL '24 hours'",
        "7d": "timestamp > NOW() - INTERVAL '7 days'",
      }[timeRange] || "timestamp > NOW() - INTERVAL '1 hour'"

    const query = `
      SELECT 
        COUNT(*) as total_events,
        COUNT(DISTINCT block_number) as blocks_with_events,
        AVG(CAST(gas_used AS NUMERIC)) as avg_gas_used,
        event_name,
        COUNT(*) as event_count
      FROM events 
      WHERE contract_address = $1 AND ${timeCondition}
      GROUP BY event_name
      ORDER BY event_count DESC
    `

    const result = await this.pool.query(query, [contractAddress])
    return result.rows
  }

  async close() {
    if (this.pool) {
      await this.pool.end()
      logger.info("Database connection closed")
    }
  }
}

module.exports = new Database()
