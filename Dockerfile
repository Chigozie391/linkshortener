FROM node:12

WORKDIR /usr/src/app

COPY package.json ./

CMD ["sh", "-c", "npm install --only=prod"]

COPY . .

ENV PORT 80

EXPOSE 80

CMD ["sh", "-c", "npm run start"]
