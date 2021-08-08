FROM node:14

COPY . /app/

WORKDIR /app/

RUN npm install

ENV PORT=5000

ENV NODE_ENV=development

EXPOSE 5000

CMD ["npm", "start"]