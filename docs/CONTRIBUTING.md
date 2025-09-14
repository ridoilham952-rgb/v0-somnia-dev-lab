# Contributing to Somnia DevLab

Thank you for your interest in contributing to Somnia DevLab! This guide will help you get started with contributing to this hackathon project.

## Project Overview

Somnia DevLab is an all-in-one developer tool suite for the Somnia Network, featuring:
- Real-time event streaming and monitoring
- Blockchain replay and state inspection
- Performance profiling and optimization
- Chaos testing and stress testing
- JavaScript/TypeScript SDK

## Development Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Git

### Local Setup

1. **Fork and clone the repository**
\`\`\`bash
git clone https://github.com/your-username/somnia-devlab.git
cd somnia-devlab
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
cd backend && npm install
cd ../sdk && npm install
\`\`\`

3. **Set up environment variables**
\`\`\`bash
cp .env.example .env.local
cp backend/.env.example backend/.env
\`\`\`

4. **Start development servers**
\`\`\`bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
npm run dev

# Terminal 3: Database
docker-compose up postgres redis
\`\`\`

## Project Structure

\`\`\`
somnia-devlab/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Real-time dashboard
│   ├── replay/           # Timeline viewer
│   ├── profiler/         # Performance analysis
│   └── chaos/            # Chaos testing
├── components/            # React components
│   ├── dashboard/        # Dashboard components
│   ├── replay/          # Replay components
│   ├── profiler/        # Profiler components
│   ├── chaos/           # Chaos testing components
│   └── ui/              # Shared UI components
├── backend/              # Node.js backend
│   ├── src/
│   │   ├── services/    # Core services
│   │   ├── routes/      # API routes
│   │   └── utils/       # Utilities
├── sdk/                  # JavaScript SDK
│   └── src/
├── contracts/            # Solidity contracts
├── scripts/             # Deployment scripts
└── docs/                # Documentation
\`\`\`

## Contributing Guidelines

### Code Style

We use ESLint and Prettier for code formatting:

\`\`\`bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
\`\`\`

### Commit Convention

We follow conventional commits:

\`\`\`
feat: add new chaos testing mode
fix: resolve WebSocket connection issue
docs: update API documentation
style: format code with prettier
refactor: improve event listener performance
test: add unit tests for profiler
chore: update dependencies
\`\`\`

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Pull Request Process

1. **Create a feature branch**
\`\`\`bash
git checkout -b feature/your-feature-name
\`\`\`

2. **Make your changes**
   - Write clean, documented code
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
\`\`\`bash
npm run test
npm run build
\`\`\`

4. **Commit your changes**
\`\`\`bash
git add .
git commit -m "feat: add your feature description"
\`\`\`

5. **Push and create PR**
\`\`\`bash
git push origin feature/your-feature-name
\`\`\`

6. **Create Pull Request**
   - Use the PR template
   - Link related issues
   - Add screenshots for UI changes
   - Request review from maintainers

## Areas for Contribution

### 🚀 High Priority

1. **Performance Optimization**
   - Improve WebSocket connection handling
   - Optimize database queries
   - Reduce bundle size

2. **Testing Coverage**
   - Unit tests for SDK functions
   - Integration tests for API endpoints
   - E2E tests for critical user flows

3. **Documentation**
   - API documentation improvements
   - More SDK examples
   - Video tutorials

### 🛠️ Medium Priority

1. **New Features**
   - Additional chaos testing scenarios
   - More profiling metrics
   - Enhanced replay functionality

2. **UI/UX Improvements**
   - Better mobile responsiveness
   - Accessibility improvements
   - Dark mode enhancements

3. **Developer Experience**
   - Better error messages
   - Improved logging
   - Development tools

### 📚 Low Priority

1. **Integrations**
   - Additional blockchain networks
   - Third-party tool integrations
   - Export functionality

2. **Advanced Features**
   - Machine learning insights
   - Predictive analytics
   - Advanced visualizations

## Development Guidelines

### Frontend Development

**Component Structure:**
\`\`\`tsx
// components/feature/component-name.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ComponentProps {
  // Define props with TypeScript
}

export function ComponentName({ prop }: ComponentProps) {
  // Component logic
  return (
    <Card>
      <CardHeader>
        <CardTitle>Component Title</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Component content */}
      </CardContent>
    </Card>
  )
}
\`\`\`

**Styling Guidelines:**
- Use Tailwind CSS classes
- Follow the design system
- Ensure responsive design
- Test in both light and dark modes

### Backend Development

**API Endpoint Structure:**
\`\`\`javascript
// backend/src/routes/feature.js
const express = require('express')
const router = express.Router()

// GET /api/feature
router.get('/', async (req, res) => {
  try {
    // Implementation
    res.json({ success: true, data })
  } catch (error) {
    logger.error('Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
\`\`\`

**Database Guidelines:**
- Use parameterized queries
- Implement proper error handling
- Add appropriate indexes
- Document schema changes

### SDK Development

**Function Structure:**
\`\`\`typescript
// sdk/src/feature.ts
export class FeatureName {
  private options: FeatureOptions

  constructor(options: FeatureOptions = {}) {
    this.options = { ...defaultOptions, ...options }
  }

  /**
   * Description of what this method does
   * @param param - Parameter description
   * @returns Promise with result
   */
  async methodName(param: string): Promise<ResultType> {
    // Implementation
  }
}
\`\`\`

## Testing

### Running Tests

\`\`\`bash
# Run all tests
npm test

# Run specific test suite
npm test -- --testPathPattern=profiler

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
\`\`\`

### Writing Tests

**Unit Tests:**
\`\`\`javascript
// __tests__/utils.test.js
import { formatGas, isValidAddress } from '../src/utils'

describe('Utils', () => {
  describe('formatGas', () => {
    it('should format gas values correctly', () => {
      expect(formatGas(21000)).toBe('21,000')
      expect(formatGas('1000000')).toBe('1,000,000')
    })
  })

  describe('isValidAddress', () => {
    it('should validate Ethereum addresses', () => {
      expect(isValidAddress('0x742d35Cc6634C0532925a3b8D4C9db96590c6C87')).toBe(true)
      expect(isValidAddress('invalid')).toBe(false)
    })
  })
})
\`\`\`

**Integration Tests:**
\`\`\`javascript
// __tests__/api.test.js
import request from 'supertest'
import { app } from '../src/server'

describe('API Endpoints', () => {
  it('should get contract events', async () => {
    const response = await request(app)
      .get('/api/events/0x742d35Cc6634C0532925a3b8D4C9db96590c6C87')
      .expect(200)

    expect(response.body).toHaveProperty('events')
    expect(Array.isArray(response.body.events)).toBe(true)
  })
})
\`\`\`

## Documentation

### Code Documentation

- Use JSDoc for JavaScript functions
- Use TSDoc for TypeScript functions
- Document complex algorithms
- Include usage examples

### API Documentation

Update `docs/API.md` when adding new endpoints:

\`\`\`markdown
### POST /api/new-endpoint

Description of the endpoint.

**Parameters:**
- `param1` (string) - Description
- `param2` (number, optional) - Description

**Response:**
\`\`\`json
{
  "success": true,
  "data": {}
}
\`\`\`

**Example:**
\`\`\`javascript
const response = await fetch('/api/new-endpoint', {
  method: 'POST',
  body: JSON.stringify({ param1: 'value' })
})
