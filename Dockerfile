FROM node:18

#RUN git clone "https://github.com/nhancv/nc-nestjs-template.git"

WORKDIR /app/nc-nestjs-template
COPY . .

RUN yarn install
RUN yarn build

ENTRYPOINT ["yarn" , "start:prod"]

EXPOSE 3000
