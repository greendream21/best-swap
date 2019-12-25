# build environment
FROM node:12.2.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

ENV REACT_APP_MIDGARD_API_URL https://localhost:8080
ENV REACT_APP_BINANCE_MAINNET_WS_URI wss://dex.binance.org/api/ws
ENV REACT_APP_BINANCE_TESTNET_WS_URI wss://testnet-dex.binance.org/api/ws
ENV REACT_APP_BINANCE_MAINNET_URL https://dex.binance.org/api/v1
ENV REACT_APP_BINANCE_TESTNET_URL https://testnet-dex.binance.org/api/v1

COPY package.json /app/package.json
RUN npm config set unsafe-perm true
RUN npm install --silent
RUN npm install react-scripts@3.0.1 -g --silent
COPY . /app
RUN npm run build

# docker environment
FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY etc/nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
