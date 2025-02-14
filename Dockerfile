FROM node:20

WORKDIR /app
COPY . .

RUN yarn install
RUN yarn build

# Set environment variable to disable ANSI colors
ENV NO_COLOR=1

EXPOSE 3000

ENTRYPOINT ["yarn" , "start:prod"]
