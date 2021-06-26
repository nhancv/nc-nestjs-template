# Scalable System Setup

## Source code
- Part 1: Optimize FE code to reduce unnecessary request to BE
- Part 2: Optimize BE code to remove all long processing api, split to smaller logic
- Part 3: Add caching to BE (use Redis/Memcached)

## Architecture
- Part 1: Setup MongoDB Replica Cluster: [mongodb_replica_setup.md](./mongodb_replica_setup.md)
- Part 2: Config scale application using PM2 Cluster (Process level)
- Part 2: Config scale application using Nginx HTTP Load Balancing (VPS level)
