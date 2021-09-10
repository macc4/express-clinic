FROM node:14

COPY . /app/

WORKDIR /app/

RUN npm install

RUN npm run build:js

ENV PORT=8080

ENV NODE_ENV=development

EXPOSE 8080

CMD ["npm", "start"]