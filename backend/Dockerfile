FROM node:18-alpine

WORKDIR /app

# Create logs directory
RUN mkdir -p logs

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/

EXPOSE 8000

CMD ["npm", "start"]
