import { EventEmitter } from "events"
import { io, type Socket } from "socket.io-client"
import type { ContractEvent, StreamOptions, ConnectionStatus } from "./types"

export class SomniaStream extends EventEmitter {
  private socket: Socket | null = null
  private contractAddress: string | null = null
  private isConnected = false
  private options: StreamOptions

  constructor(options: StreamOptions = {}) {
    super()
    this.options = {
      backendUrl: "http://localhost:8000",
      autoReconnect: true,
      reconnectDelay: 1000,
      maxReconnectAttempts: 5,
      ...options,
    }
  }

  /**
   * Connect to the Somnia DevLab backend
   */
  async connect(): Promise<void> {
    if (this.socket) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      this.socket = io(this.options.backendUrl!, {
        transports: ["websocket"],
        autoConnect: true,
      })

      this.socket.on("connect", () => {
        this.isConnected = true
        this.emit("connected")
        resolve()
      })

      this.socket.on("disconnect", () => {
        this.isConnected = false
        this.emit("disconnected")
      })

      this.socket.on("connect_error", (error) => {
        this.emit("error", error)
        reject(error)
      })

      this.socket.on("new-event", (event: ContractEvent) => {
        this.emit("event", event)
        this.emit(event.eventName, event)
      })

      this.socket.on("recent-events", (events: ContractEvent[]) => {
        this.emit("recent-events", events)
      })

      this.socket.on("metrics-update", (metrics) => {
        this.emit("metrics", metrics)
      })

      this.socket.on("new-block", (block) => {
        this.emit("block", block)
      })
    })
  }

  /**
   * Subscribe to events from a specific contract
   */
  subscribe(contractAddress: string): void {
    if (!this.socket || !this.isConnected) {
      throw new Error("Not connected to backend. Call connect() first.")
    }

    this.contractAddress = contractAddress
    this.socket.emit("subscribe", contractAddress)
    this.emit("subscribed", contractAddress)
  }

  /**
   * Unsubscribe from current contract events
   */
  unsubscribe(): void {
    if (!this.socket || !this.contractAddress) {
      return
    }

    this.socket.emit("unsubscribe", this.contractAddress)
    this.emit("unsubscribed", this.contractAddress)
    this.contractAddress = null
  }

  /**
   * Listen for specific event types
   */
  on(eventName: string, listener: (...args: any[]) => void): this {
    return super.on(eventName, listener)
  }

  /**
   * Remove event listeners
   */
  off(eventName: string, listener: (...args: any[]) => void): this {
    return super.off(eventName, listener)
  }

  /**
   * Disconnect from the backend
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
      this.contractAddress = null
    }
  }

  /**
   * Get connection status
   */
  getStatus(): ConnectionStatus {
    return {
      connected: this.isConnected,
      contractAddress: this.contractAddress,
    }
  }

  /**
   * Get recent events for the subscribed contract
   */
  async getRecentEvents(limit = 50): Promise<ContractEvent[]> {
    if (!this.contractAddress) {
      throw new Error("No contract subscribed")
    }

    const response = await fetch(`${this.options.backendUrl}/api/events/${this.contractAddress}?limit=${limit}`)
    const data = await response.json()
    return data.events
  }

  /**
   * Get contract metrics
   */
  async getMetrics(timeRange = "1h"): Promise<any> {
    if (!this.contractAddress) {
      throw new Error("No contract subscribed")
    }

    const response = await fetch(
      `${this.options.backendUrl}/api/metrics/${this.contractAddress}?timeRange=${timeRange}`,
    )
    return response.json()
  }
}
