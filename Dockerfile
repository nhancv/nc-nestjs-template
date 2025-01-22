FROM node:20

WORKDIR /app
COPY . .

RUN yarn install
RUN yarn build

ENTRYPOINT ["yarn" , "start:prod"]
