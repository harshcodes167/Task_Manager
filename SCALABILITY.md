# Scalability & Architecture Note

## Current Architecture
Monolithic Node.js + Express app with MongoDB. Suitable for MVP and moderate load.

## Scaling Strategy

### Horizontal Scaling
- The app is stateless (JWT, not sessions), so multiple instances can run behind a load balancer (NGINX, AWS ALB) without shared session state.
- Docker + Kubernetes enables easy horizontal pod autoscaling based on CPU/memory.

### Microservices Path
As traffic grows, split into services:
- **Auth Service** — handles registration, login, JWT issuing
- **Task Service** — CRUD for tasks
- **Notification Service** — email/push (future)
- **Admin Service** — management & stats

Communicate via REST or message queues (RabbitMQ / Kafka).

### Caching (Redis)
- Cache frequently read data (user profiles, task lists) with TTL
- Cache JWT blacklist for logout invalidation
- Session caching if switching to session-based auth

```js
// Example: Redis cache middleware
const cached = await redis.get(`tasks:${userId}`);
if (cached) return res.json(JSON.parse(cached));
// ...fetch from DB, then cache
await redis.setEx(`tasks:${userId}`, 300, JSON.stringify(data));
```

### Database Scaling
- **Read replicas** for MongoDB to offload read queries
- **Indexing** already applied on `user + status` and `user + createdAt`
- **MongoDB Atlas** for managed cloud scaling with auto-sharding

### Load Balancing
- NGINX reverse proxy in front of multiple Node instances
- Sticky sessions not needed (stateless JWT)

### Rate Limiting & Security at Scale
- Move rate limiting to API Gateway (AWS API Gateway / Kong)
- Centralized logging with Winston + ELK Stack (Elasticsearch, Logstash, Kibana)

### Docker Deployment

```dockerfile
# Dockerfile (backend)
FROM node:18-alpine
WORKDIR /app
COPY package*.json .
RUN npm ci --only=production
COPY src ./src
EXPOSE 5000
CMD ["node", "src/server.js"]
```

```yaml
# docker-compose.yml
version: '3'
services:
  backend:
    build: ./backend
    ports: ["5000:5000"]
    environment:
      - MONGODB_URI=mongodb://mongo:27017/taskmanager
      - JWT_SECRET=your_secret
    depends_on: [mongo]
  mongo:
    image: mongo:6
    volumes: [mongo_data:/data/db]
  frontend:
    build: ./frontend
    ports: ["3000:80"]
volumes:
  mongo_data:
```

## Summary
The current codebase is structured for easy extraction into microservices. Each controller is isolated, middleware is reusable, and the stateless JWT approach enables horizontal scaling from day one.
