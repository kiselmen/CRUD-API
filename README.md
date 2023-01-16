# CRUD-API

Установка:

clone repo
npm install

Для запуска воспользоваться командой

npm run start:prod - Production mode
npm run start:multi - Mode with balancer
npm run start:dev - Development mode
npm run test -Test

PORT = 4000.

Для проверки использован postman.

Получение всех пользователей: запрос GET на адрес localhost:4000/api/users. Первый запуск - пустой массив.

Добавление пользователя - запрос POST на адрес localhost:4000/api/users. Поля username, hobbies, age - обязательные.
Формат для передачи JSON. Пример { "username": "Ivan", "age": "45", "hobbies": ["mafia"] }

Обновление пользователя - запрос PUT на адрес localhost:4000/api/users/id, где id - id пользователя (обязателен).
Можно передавать часть данных для обновления. Пример { "id": "a9214840-e928-493f-91cc-a8e343595644", "username": "Vasili" }

Получение одного пользователя - запрос GET на адрес localhost:4000/api/users/id, где id - id пользователя (обязателен).

Удаление пользователя - запрос DELETE на адрес ниже. localhost:4000/api/users/id, где id - id пользователя (обязателен).
