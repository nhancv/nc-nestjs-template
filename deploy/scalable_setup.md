# Scalable System Setup

## Source code
- Part 1: Optimize FE code to reduce unnecessary request to BE
- Part 2: Optimize BE code to remove all long processing api, split to smaller logic
- Part 3: Add caching to BE (use Redis/Memcached)

## Architecture
- Part 1: Setup MongoDB Replica Cluster: [mongodb_replica_setup.md](./mongodb_replica_setup.md)
- Part 2: Config scale application process level using PM2 Cluster
- Part 3: Config scale server level using Nginx HTTP Load Balancing
- Part 4: Config scale dns level with HAProxy
