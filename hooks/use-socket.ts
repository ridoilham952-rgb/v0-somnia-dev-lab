"use client"

import { useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000", {
      transports: ["websocket"],
    })

    socketInstance.on("connect", () => {
      console.log("Connected to backend")
      setIsConnected(true)
    })

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from backend")
      setIsConnected(false)
    })

    socketInstance.on("connect_error", (error) => {
      console.error("Connection error:", error)
      setIsConnected(false)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return { socket, isConnected }
}
