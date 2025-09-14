import type { ChaosOptions, ChaosTest, TestConfig } from "./types"

export class SomniaChaos {
  private options: ChaosOptions

  constructor(options: ChaosOptions = {}) {
    this.options = {
      backendUrl: "http://localhost:8000",
      ...options,
    }
  }

  /**
   * Start a chaos test
   */
  async startTest(
    contractAddress: string,
    testType: "load" | "stress" | "attack",
    config: TestConfig,
  ): Promise<string> {
    const response = await fetch(`${this.options.backendUrl}/api/chaos/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contractAddress,
        testType,
        ...config,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to start test: ${response.statusText}`)
    }

    const data = await response.json()
    return data.testId
  }

  /**
   * Get test status
   */
  async getTestStatus(testId: string): Promise<ChaosTest> {
    const response = await fetch(`${this.options.backendUrl}/api/chaos/${testId}/status`)

    if (!response.ok) {
      throw new Error(`Failed to get test status: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Stop a running test
   */
  async stopTest(testId: string): Promise<void> {
    const response = await fetch(`${this.options.backendUrl}/api/chaos/${testId}/stop`, {
      method: "POST",
    })

    if (!response.ok) {
      throw new Error(`Failed to stop test: ${response.statusText}`)
    }
  }

  /**
   * Get test results
   */
  async getTestResults(testId: string): Promise<any> {
    const response = await fetch(`${this.options.backendUrl}/api/chaos/${testId}/results`)

    if (!response.ok) {
      throw new Error(`Failed to get test results: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Run a quick load test
   */
  async quickLoadTest(contractAddress: string, duration = 60): Promise<string> {
    return this.startTest(contractAddress, "load", {
      duration,
      intensity: 50,
      concurrent: 10,
      transactionType: "mixed",
    })
  }

  /**
   * Run a stress test
   */
  async stressTest(contractAddress: string, intensity = 80): Promise<string> {
    return this.startTest(contractAddress, "stress", {
      duration: 120,
      intensity,
      concurrent: 50,
      transactionType: "mixed",
    })
  }

  /**
   * Run security attack simulation
   */
  async attackSimulation(contractAddress: string): Promise<string> {
    return this.startTest(contractAddress, "attack", {
      duration: 180,
      intensity: 70,
      concurrent: 20,
      enableReentrancy: true,
      enableOverflow: true,
      enableDOS: true,
    })
  }
}
