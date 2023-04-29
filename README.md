# NestJS Template

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Requisites

- Git (already config user)

```bash
# Install
sudo apt install -y git

# Config
git config --global user.name "YourName"
git config --global user.email "YourEmail"
```

- Nodejs

```
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

- Yarn

```
sudo npm install --global yarn
```

## Installation

- Clone BE

```bash
git clone https://github.com/nhancv/nc-nestjs-template.git
cd nc-nestjs-template
```

- Install libs

```bash
yarn install
```

- Configuration

```bash
cp .env_sample .env
=> Correct env content
```

## Development

```bash
# Develop without watch mode
yarn start

# Develop in watch mode
yarn start:dev
```

## Testing

```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e

# Test coverage
yarn test:cov
```

## Production

```bash
# Build
yarn build

# Run app in production
yarn start:prod
```

## Deploy to integration [HEROKU]

### Getting started with Heroku

```bash
heroku login
heroku create <app name>
git add .
git commit -m 'ci: deploy to heroku'
git push heroku master

# Test at: <app name>.herokuapp.com
# Log view: heroku logs -t
```
