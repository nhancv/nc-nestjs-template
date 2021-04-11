# STARTER KIT

## User

### Database
```
uid       : unique (user id)
username  : unique
email     : unique
fullName?
```

### Api
```
GET     /api/users/search
GET     /api/users
POST    /api/users
PUT     /api/users
DELETE  /api/users
GET     /api/users/{uid}
```

## Admin

### Database
```
uid       : unique
role      : default is admin
```

### Api
```
GET     /api/admins
POST    /api/admins
PUT     /api/admins
GET     /api/admins/all
DELETE  /api/admins/{uid}
```

## Auth token

### Database
```
tid       : unique (token id)
uid
accessToken
duration
```

### Api
```
POST    /api/auth/login
```

## Others
- In memory DB
- Socket IO
- Cronjob
- Rate limiting

------------------

# NestJS Template

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# build production app
$ npm run build

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deploy to integration [HEROKU]

### Getting started with Heroku
```
heroku login
heroku create <app name>
git add .
git commit -m 'deploy to heroku'
git push heroku master

Test at: <app name>.herokuapp.com
Log view: heroku logs -t
```

