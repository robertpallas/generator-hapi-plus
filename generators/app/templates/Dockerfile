FROM risingstack/alpine:3.4-v6.7.0-4.0.0

MAINTAINER <%- author %>

RUN apk update

ENV NODE_ENV production
ENV DB_ENV live
ENV PORT 3000

EXPOSE 3000

COPY package.json package.json
RUN npm install --only=production

COPY . .

CMD npm start