FROM node:18

#RUN git clone "https://github.com/nhancv/nc-nestjs-template.git"

WORKDIR /app
COPY . .

RUN yarn install
RUN yarn build

ENTRYPOINT ["yarn" , "start:prod"]
