# Deployment Guide

## Local Development

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker (optional)

### Setup

1. **Clone the repository**
\`\`\`bash
git clone https://github.com/somnia-network/devlab.git
cd devlab
\`\`\`

2. **Install dependencies**
\`\`\`bash
# Frontend
npm install

# Backend
cd backend
npm install

# SDK
cd ../sdk
npm install
\`\`\`

3. **Environment Configuration**

Create `.env` files:

**Frontend (.env.local):**
\`\`\`env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_SOMNIA_RPC_URL=https://rpc.somnia.network
\`\`\`

**Backend (.env):**
\`\`\`env
PORT=8000
NODE_ENV=development
DATABASE_URL=postgresql://devlab:password@localhost:5432/somnia_devlab
SOMNIA_RPC_URL=https://rpc.somnia.network
REDIS_URL=redis://localhost:6379
LOG_LEVEL=info
\`\`\`

4. **Database Setup**
\`\`\`bash
# Create PostgreSQL database
createdb somnia_devlab

# Run migrations (backend will auto-create tables)
cd backend
npm start
\`\`\`

5. **Start Services**
\`\`\`bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
npm run dev

# Terminal 3: Redis (if not using Docker)
redis-server
\`\`\`

## Docker Deployment

### Development with Docker Compose

\`\`\`bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
\`\`\`

### Production Docker Setup

1. **Build images**
\`\`\`bash
# Frontend
docker build -t somnia-devlab-frontend .

# Backend
docker build -t somnia-devlab-backend ./backend
\`\`\`

2. **Run with production compose**
\`\`\`bash
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

## Cloud Deployment

### Vercel (Frontend)

1. **Connect repository to Vercel**
2. **Set environment variables:**
   - `NEXT_PUBLIC_BACKEND_URL`
   - `NEXT_PUBLIC_SOMNIA_RPC_URL`

3. **Deploy**
\`\`\`bash
vercel --prod
\`\`\`

### Railway (Backend)

1. **Connect repository to Railway**
2. **Set environment variables:**
   - `DATABASE_URL` (Railway PostgreSQL)
   - `REDIS_URL` (Railway Redis)
   - `SOMNIA_RPC_URL`
   - `PORT=8000`

3. **Deploy automatically on push**

### AWS Deployment

#### Frontend (S3 + CloudFront)

\`\`\`bash
# Build static files
npm run build
npm run export

# Upload to S3
aws s3 sync out/ s3://your-bucket-name

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
\`\`\`

#### Backend (ECS)

1. **Create ECR repository**
\`\`\`bash
aws ecr create-repository --repository-name somnia-devlab-backend
\`\`\`

2. **Build and push image**
\`\`\`bash
# Build
docker build -t somnia-devlab-backend ./backend

# Tag
docker tag somnia-devlab-backend:latest YOUR_ECR_URI:latest

# Push
docker push YOUR_ECR_URI:latest
\`\`\`

3. **Create ECS service with:**
   - RDS PostgreSQL instance
   - ElastiCache Redis cluster
   - Application Load Balancer

### Google Cloud Platform

#### Frontend (Cloud Run)

\`\`\`bash
# Build container
gcloud builds submit --tag gcr.io/PROJECT_ID/somnia-devlab-frontend

# Deploy
gcloud run deploy somnia-devlab-frontend \
  --image gcr.io/PROJECT_ID/somnia-devlab-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
\`\`\`

#### Backend (Cloud Run + Cloud SQL)

\`\`\`bash
# Deploy backend
gcloud run deploy somnia-devlab-backend \
  --image gcr.io/PROJECT_ID/somnia-devlab-backend \
  --platform managed \
  --region us-central1 \
  --set-env-vars DATABASE_URL=postgresql://... \
  --set-env-vars REDIS_URL=redis://... \
  --allow-unauthenticated
\`\`\`

## Environment Variables Reference

### Frontend
- `NEXT_PUBLIC_BACKEND_URL` - Backend API URL
- `NEXT_PUBLIC_SOMNIA_RPC_URL` - Somnia Network RPC endpoint

### Backend
- `PORT` - Server port (default: 8000)
- `NODE_ENV` - Environment (development/production)
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `SOMNIA_RPC_URL` - Somnia Network RPC endpoint
- `LOG_LEVEL` - Logging level (debug/info/warn/error)
- `FRONTEND_URL` - Frontend URL for CORS

## SSL/TLS Configuration

### Let's Encrypt with Nginx

\`\`\`nginx
server {
    listen 80;
    server_name api.somniadevlab.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.somniadevlab.com;

    ssl_certificate /etc/letsencrypt/live/api.somniadevlab.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.somniadevlab.com/privkey.pem;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

## Monitoring and Logging

### Application Monitoring

\`\`\`javascript
// backend/src/monitoring.js
const prometheus = require('prom-client')

// Create metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status']
})

const activeConnections = new prometheus.Gauge({
  name: 'websocket_active_connections',
  help: 'Number of active WebSocket connections'
})

// Export metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', prometheus.register.contentType)
  res.end(await prometheus.register.metrics())
})
\`\`\`

### Log Aggregation

\`\`\`yaml
# docker-compose.logging.yml
version: '3.8'
services:
  app:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  fluentd:
    image: fluent/fluentd:v1.14
    volumes:
      - ./fluentd/conf:/fluentd/etc
    ports:
      - "24224:24224"
\`\`\`

## Performance Optimization

### Frontend Optimization

\`\`\`javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  httpAgentOptions: {
    keepAlive: true,
  },
}

export default nextConfig
\`\`\`

### Backend Optimization

\`\`\`javascript
// backend/src/optimization.js
const compression = require('compression')
const helmet = require('helmet')

// Enable compression
app.use(compression())

// Security headers
app.use(helmet())

// Connection pooling
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})
\`\`\`

## Backup and Recovery

### Database Backup

\`\`\`bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
rm backup_$DATE.sql
\`\`\`

### Automated Backups

\`\`\`yaml
# kubernetes/cronjob.yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: database-backup
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:15
            command: ["/bin/bash", "-c"]
            args:
            - |
              pg_dump $DATABASE_URL > /backup/backup_$(date +%Y%m%d_%H%M%S).sql
              aws s3 cp /backup/*.sql s3://your-backup-bucket/
          restartPolicy: OnFailure
\`\`\`

## Security Considerations

### API Security

\`\`\`javascript
// Rate limiting
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
})

app.use('/api/', limiter)

// Input validation
const { body, validationResult } = require('express-validator')

app.post('/api/contracts',
  body('address').isEthereumAddress(),
  body('abi').isArray(),
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    // Process request
  }
)
\`\`\`

### Network Security

\`\`\`bash
# Firewall rules
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw deny 8000/tcp   # Block direct backend access
ufw enable
\`\`\`

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Check CORS settings
   - Verify backend URL
   - Check firewall rules

2. **Database Connection Error**
   - Verify connection string
   - Check database server status
   - Ensure proper permissions

3. **High Memory Usage**
   - Monitor event buffer sizes
   - Implement proper cleanup
   - Use connection pooling

### Debug Mode

\`\`\`bash
# Enable debug logging
DEBUG=* npm run dev

# Backend debug
LOG_LEVEL=debug npm start

# Frontend debug
NEXT_PUBLIC_DEBUG=true npm run dev
\`\`\`

### Health Checks

\`\`\`javascript
// Health check endpoint
app.get('/health', async (req, res) => {
  const checks = {
    database: false,
    redis: false,
    blockchain: false
  }

  try {
    await pool.query('SELECT 1')
    checks.database = true
  } catch (error) {
    console.error('Database health check failed:', error)
  }

  try {
    await redis.ping()
    checks.redis = true
  } catch (error) {
    console.error('Redis health check failed:', error)
  }

  try {
    await provider.getBlockNumber()
    checks.blockchain = true
  } catch (error) {
    console.error('Blockchain health check failed:', error)
  }

  const healthy = Object.values(checks).every(check => check)
  
  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'healthy' : 'unhealthy',
    checks,
    timestamp: new Date().toISOString()
  })
})
