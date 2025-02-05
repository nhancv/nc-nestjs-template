FROM node:20

WORKDIR /app
COPY . .

RUN yarn install
RUN yarn build

EXPOSE 3000

ENTRYPOINT ["yarn" , "start:prod"]
