# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM mwangxx/node-frontend:12 as build-stage
WORKDIR /app
COPY package*.json /app/
COPY nginx.conf /app/
RUN npm install
COPY ./ /app/
RUN npm run build
# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15
COPY --from=build-stage /app/build/ /usr/share/nginx/html
RUN mkdir -p /usr/share/nginx/html/public/items/static
COPY --from=build-stage /app/build/static/ /usr/share/nginx/html/public/items/static
# Copy the default nginx.conf provided by tiangolo/node-frontend
# COPY --from=build-stage /nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY main-site /usr/share/nginx/home 