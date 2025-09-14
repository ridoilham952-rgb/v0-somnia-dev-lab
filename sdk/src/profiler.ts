import type { ProfilerOptions, ProfileResult, FunctionProfile } from "./types"

export class SomniaProfiler {
  private options: ProfilerOptions

  constructor(options: ProfilerOptions = {}) {
    this.options = {
      backendUrl: "http://localhost:8000",
      ...options,
    }
  }

  /**
   * Analyze a smart contract's performance
   */
  async analyze(
    contractAddress: string,
    analysisType: "gas" | "performance" | "security" = "gas",
  ): Promise<ProfileResult> {
    const response = await fetch(`${this.options.backendUrl}/api/profiler/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contractAddress,
        analysisType,
      }),
    })

    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get function-level performance metrics
   */
  async getFunctionMetrics(contractAddress: string): Promise<FunctionProfile[]> {
    const response = await fetch(`${this.options.backendUrl}/api/profiler/functions/${contractAddress}`)

    if (!response.ok) {
      throw new Error(`Failed to get function metrics: ${response.statusText}`)
    }

    const data = await response.json()
    return data.functions
  }

  /**
   * Generate optimization suggestions
   */
  async getOptimizationSuggestions(contractAddress: string): Promise<any[]> {
    const response = await fetch(`${this.options.backendUrl}/api/profiler/suggestions/${contractAddress}`)

    if (!response.ok) {
      throw new Error(`Failed to get suggestions: ${response.statusText}`)
    }

    const data = await response.json()
    return data.suggestions
  }

  /**
   * Compare performance between two contracts
   */
  async compare(contractA: string, contractB: string): Promise<any> {
    const response = await fetch(`${this.options.backendUrl}/api/profiler/compare`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contractA,
        contractB,
      }),
    })

    if (!response.ok) {
      throw new Error(`Comparison failed: ${response.statusText}`)
    }

    return response.json()
  }
}
