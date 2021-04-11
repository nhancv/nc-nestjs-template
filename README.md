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
GET     /users/search
GET     /users
GET     /users/{uid}
POST    /users
PUT     /users
DELETE  /users
```

## Admin

### Database
```
uid       : unique
role      : default is admin
```

### Api
```
GET     /admins
GET     /admins/all
POST    /admins
PUT     /admins
DELETE  /admins/{uid}
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

