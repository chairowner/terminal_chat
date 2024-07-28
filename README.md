# terminal_chat application

## Introduction / Предисловие

This chat on WebSockets was created by _chairowner_ in 2024 **as part of the self-study of libraries**.\
If you want to use its basis to implement your idea, do it at your own risk, because this code was written at night after work (•‿•)\
Please inform me that you have taken the code. I will be glad to see your final result.

---

Этот чат на веб-сокетах был создан _chairowner_ в 2024 году **в рамках самостоятельного изучения библиотек**.\
Если вы хотите использовать его основу для реализации своей идеи, делайте это на свой страх и риск, т.к. код писался ночами после работы (•‿•)\
Пожалуйста, сообщите мне, если вы взяли код. Я буду рад увидеть ваш окончательный результат.

## Screenshots / Скриншоты

<figure>
  <img src="./res/images/chat.png" alt="chat" />
  <figcaption>Chat page</figcaption>
</figure>

<figure>
  <img src="./res/images/login.png" alt="login" />
  <figcaption>Login page</figcaption>
</figure>

<figure>
  <img src="./res/images/registration.png" alt="registration" />
  <figcaption>Registration page</figcaption>
</figure>

## Startup / Запуск

First, install **docker-compose** / **Docker Desktop**. It will be used to launch the database.\
You can also run it via **Docker Swarm** `./stack.yml`

---

Для начала установите **docker-compose** / **Docker Desktop**. С его помощью будет запускаться база данных.\
Также можно запустить через **Docker Swarm** `./stack.yml`

### Windows

Register `start dev.bat` from the root directory of the project

---

Прописать `start dev.bat` из корневой директории проекта

### Linux

1. `docker-compose -p terminal_chat up -d --build`
2. `cd ./server && npm i && npm run dev`
3. `cd ./client && npm i && npm run dev`
