### Инструкция по установке
## База данных
1. Создать в базу данных `XCMS`
2. Если в БД не установлено расширение генерации uuid: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
3. Настроить конфигурации подключения к базе данных в `.env`

## Проект
1. `git clone <repo> -b <branch>`
2. `cd <appFolder>`
3. `npm i && npm run prisma:generate`
4. Создать миграцию: `npm run migrate:dev`
5. Тестовые данные: `npm run seed`
