FROM node:12

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

ENV PORT 80

EXPOSE 80

CMD ["sh", "-c", "npm run start"]
