# Используем базовый образ для сборки
FROM node:18-alpine AS build

WORKDIR /app

# Копируем package.json и package-lock.json (или yarn.lock)
COPY ./client/package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY ./client ./

# Выполняем сборку
RUN npm run build:prod

# Используем базовый образ для продакшн
FROM nginx:latest

# Копируем конфигурацию Nginx
COPY ./docker/nginx/configs/default.conf /etc/nginx/conf.d/default.conf

# Копируем результаты сборки из предыдущего образа
COPY --from=build /app/build /var/www/html

EXPOSE 80 443
