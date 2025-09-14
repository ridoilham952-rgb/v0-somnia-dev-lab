# Somnia DevLab

An all-in-one developer tool suite for the Somnia Network - the ultra-fast EVM-compatible L1 blockchain with 1M+ TPS and sub-second finality.

## Features

🚀 **Real-time Event Streaming Dashboard**
- Subscribe to contract events in real-time
- Display live charts for TPS, error rates, and latency
- WebSocket-powered updates

⏰ **Replay Timeline Viewer**
- Store transaction logs and state diffs
- Interactive timeline slider to scrub through block history
- Inspect contract state at any point in time

📊 **Performance Profiler**
- Analyze gas consumption and execution time
- Identify performance bottlenecks in smart contracts
- Visual ranking of expensive functions

⚡ **Chaos Mode Testing**
- Stress test contracts with high-volume transactions
- Simulate attack scenarios (reentrancy, revert loops)
- Monitor resilience metrics and failure rates

🛠️ **Developer SDK**
- Simple JavaScript/TypeScript SDK for event streaming
- Auto-generated documentation and examples
- Easy integration with existing projects

## Quick Start

### Installation

\`\`\`bash
npm install somnia-devlab
\`\`\`

### Basic Usage

\`\`\`javascript
import { SomniaStream } from "somnia-devlab";

// Subscribe to contract events
SomniaStream.on("Swap", (event) => {
  console.log("New swap:", event);
});

// Start monitoring
SomniaStream.connect("0xYourContractAddress");
\`\`\`

### Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Deploy sample contracts: `npm run deploy`

### Docker Setup

\`\`\`bash
docker-compose up -d
\`\`\`

## Architecture

\`\`\`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Somnia        │
│   (Next.js)     │◄──►│   (Node.js)     │◄──►│   Network       │
│                 │    │                 │    │                 │
│ • Dashboard     │    │ • WebSocket     │    │ • Smart         │
│ • Replay        │    │ • Event Listener│    │   Contracts     │
│ • Profiler      │    │ • Database      │    │ • Blocks        │
│ • Chaos Mode    │    │ • API Routes    │    │ • Transactions  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │              ┌─────────────────┐
         │              │   PostgreSQL    │
         └──────────────┤   Database      │
                        │                 │
                        │ • Events        │
                        │ • Blocks        │
                        │ • State History │
                        └─────────────────┘
\`\`\`

## Demo Flow

1. Deploy sample ERC20 or MiniDEX contract to Somnia testnet
2. Run Chaos Mode to flood with 1000+ transactions
3. Monitor real-time dashboard with live TPS and error metrics
4. Use Replay Timeline to inspect specific blocks and state changes
5. Analyze Performance Profiler reports for optimization insights

## Contributing

This is a hackathon project built for the Somnia Network ecosystem. Contributions welcome!

## License

MIT License - see LICENSE file for details.

## 🎯 Hackathon Demo Flow

1. **Deploy Sample Contracts**
   \`\`\`bash
   npm run deploy
   \`\`\`

2. **Start Monitoring**
   - Open dashboard at `http://localhost:3000/dashboard`
   - Enter deployed contract address
   - Watch real-time events stream in

3. **Run Chaos Mode**
   - Navigate to `http://localhost:3000/chaos`
   - Configure load test with 1000+ transactions
   - Monitor TPS, error rates, and resilience metrics

4. **Analyze Performance**
   - Go to `http://localhost:3000/profiler`
   - Run gas analysis on your contract
   - View function rankings and optimization suggestions

5. **Replay History**
   - Visit `http://localhost:3000/replay`
   - Load blockchain data for specific block range
   - Scrub through timeline to inspect state changes

6. **Use SDK**
   \`\`\`javascript
   import { SomniaStream } from "somnia-devlab"
   
   const stream = new SomniaStream()
   await stream.connect()
   stream.subscribe("0xYourContractAddress")
   
   stream.on("Swap", (event) => {
     console.log("New swap detected:", event)
   })
   \`\`\`

## 📊 Features Showcase

### Real-time Dashboard
- **Live Event Streaming**: WebSocket-powered real-time updates
- **TPS Monitoring**: Track transactions per second
- **Error Rate Analysis**: Monitor failed transactions
- **Gas Usage Metrics**: Analyze gas consumption patterns

### Replay Timeline
- **Block History Navigation**: Scrub through blockchain history
- **State Inspection**: View contract state at any block
- **Event Timeline**: Visual timeline of all contract events
- **State Diff Analysis**: Compare state changes between blocks

### Performance Profiler
- **Gas Analysis**: Identify gas-heavy functions
- **Function Ranking**: Sort functions by performance impact
- **Optimization Suggestions**: AI-powered improvement recommendations
- **Bottleneck Detection**: Find performance bottlenecks

### Chaos Testing
- **Load Testing**: Simulate high transaction volumes
- **Stress Testing**: Push contracts to their limits
- **Attack Simulation**: Test against common vulnerabilities
- **Resilience Metrics**: Measure contract robustness

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 18, TailwindCSS, Recharts, Socket.IO
- **Backend**: Node.js, Express, Socket.IO, PostgreSQL, Redis
- **Blockchain**: Ethers.js, Web3.js, Hardhat
- **Database**: PostgreSQL with real-time event storage
- **Deployment**: Docker, Vercel, Railway

## 🚀 Quick Start

### Option 1: Docker (Recommended)

\`\`\`bash
git clone https://github.com/somnia-network/devlab.git
cd devlab
docker-compose up -d
\`\`\`

Visit `http://localhost:3000` to access the dashboard.

### Option 2: Manual Setup

\`\`\`bash
# Clone repository
git clone https://github.com/somnia-network/devlab.git
cd devlab

# Install dependencies
npm install
cd backend && npm install && cd ..

# Set up environment
cp .env.example .env.local
cp backend/.env.example backend/.env

# Start services
npm run dev        # Frontend (Terminal 1)
cd backend && npm run dev  # Backend (Terminal 2)
\`\`\`

## 📚 SDK Usage

### Installation

\`\`\`bash
npm install somnia-devlab
\`\`\`

### Basic Usage

\`\`\`javascript
import { SomniaStream, SomniaProfiler, SomniaChaos } from "somnia-devlab"

// Real-time monitoring
const stream = new SomniaStream()
await stream.connect()
stream.subscribe("0xContractAddress")

stream.on("Transfer", (event) => {
  console.log(`Transfer: ${event.args[2]} tokens`)
})

// Performance analysis
const profiler = new SomniaProfiler()
const analysis = await profiler.analyze("0xContractAddress")
console.log(`Optimization score: ${analysis.optimizationScore}/100`)

// Chaos testing
const chaos = new SomniaChaos()
const testId = await chaos.quickLoadTest("0xContractAddress", 60)
\`\`\`

## 🎮 Demo Scenarios

### Scenario 1: DeFi Protocol Monitoring
1. Deploy MiniDEX contract
2. Monitor swap events in real-time
3. Analyze gas usage patterns
4. Run load test with 500 concurrent swaps

### Scenario 2: Token Contract Analysis
1. Deploy ERC20 token contract
2. Profile transfer function performance
3. Identify optimization opportunities
4. Test against reentrancy attacks

### Scenario 3: Historical Debugging
1. Load problematic block range
2. Replay transactions step by step
3. Inspect state changes
4. Identify root cause of issues

## 🏆 Hackathon Achievements

- ✅ **Real-time Event Streaming** - WebSocket-powered live updates
- ✅ **Blockchain Replay System** - Navigate through block history
- ✅ **Performance Profiler** - Gas analysis and optimization
- ✅ **Chaos Testing Engine** - Stress testing and attack simulation
- ✅ **Developer SDK** - Easy integration for developers
- ✅ **Modern UI/UX** - Professional dashboard interface
- ✅ **Docker Deployment** - One-command setup
- ✅ **Comprehensive Documentation** - API docs and examples

## 🔮 Future Roadmap

- **Machine Learning Insights**: Predictive analytics for gas optimization
- **Multi-chain Support**: Extend beyond Somnia Network
- **Advanced Visualizations**: 3D blockchain explorer
- **Collaborative Features**: Team debugging and analysis
- **Plugin System**: Extensible architecture for custom tools

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Somnia Network** for the ultra-fast blockchain infrastructure
- **Hackathon Organizers** for the opportunity to build
- **Open Source Community** for the amazing tools and libraries

---

**Built with ❤️ for the Somnia Network Hackathon**

*Showcasing the power of 1M+ TPS and sub-second finality*
