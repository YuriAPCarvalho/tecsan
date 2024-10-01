FROM node:18-bullseye-slim

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

ARG ENV_FILE=.env.production
COPY ${ENV_FILE} .env

RUN export $(cat .env | grep -v ^# | xargs)

RUN npm run build

EXPOSE ${PORT}

CMD ["npm", "run", "start"]
