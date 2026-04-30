# Task Tracker

Трекер задач с приоритетами, сроками, категориями и матрицей Эйзенхауэра.  
Авторизация: email/пароль или номер телефона через **Telegram Gateway**.

---

## ENV-переменные

| Переменная | Назначение | Где взять |
|---|---|---|
| `DATABASE_URL` | Строка подключения к Neon PostgreSQL | Neon Console → Connection string |
| `AUTH_SECRET` | Секрет для NextAuth JWT и подписи phone-cookies | `openssl rand -base64 32` |
| `TELEGRAM_GATEWAY_TOKEN` | Токен Telegram Gateway API | [gateway.telegram.org](https://gateway.telegram.org) |

Пример `.env.local`:
```env
DATABASE_URL=postgresql://...
AUTH_SECRET=your_random_secret_here
TELEGRAM_GATEWAY_TOKEN=your_telegram_gateway_token
```

---

## Как получить токен Telegram Gateway

1. Перейди на [gateway.telegram.org](https://gateway.telegram.org)
2. Войди через свой Telegram-аккаунт
3. Нажми **Create API token**
4. Скопируй токен и добавь в `TELEGRAM_GATEWAY_TOKEN`

> **Важно:** Telegram Gateway требует верификации и одобрения аккаунта.  
> Бесплатный тариф: 100 сообщений/месяц.

---

## Как запустить локально

```bash
# 1. Установить Node.js 18+
# 2. Клонировать репозиторий
git clone https://github.com/alexkotor95-glitch/task-tracker
cd task-tracker

# 3. Установить зависимости
npm install

# 4. Создать .env.local (см. выше)

# 5. Инициализировать БД (один раз)
node scripts/init-db.mjs

# 6. Запустить миграцию для phone auth (один раз)
node scripts/migrate-phone.mjs

# 7. Запустить dev-сервер
npm run dev -- --port 3000
```

Открыть: http://localhost:3000

---

## Как задеплоить на Vercel

### Через Vercel CLI
```bash
# Авторизоваться
npx vercel login

# Добавить переменные окружения
npx vercel env add DATABASE_URL production
npx vercel env add AUTH_SECRET production
npx vercel env add TELEGRAM_GATEWAY_TOKEN production

# Задеплоить
npx vercel --prod
```

### Через GitHub (автодеплой)
1. Подключи репозиторий в [vercel.com/dashboard](https://vercel.com/dashboard)
2. Добавь ENV-переменные в **Settings → Environment Variables**
3. Каждый `git push main` → автоматический деплой

---

## Архитектура phone auth

```
Client                     Server                  Telegram Gateway
  |                           |                            |
  |-- POST /api/auth/phone/send (phone) -->                |
  |                           |-- sendVerificationMessage -->|
  |                           |<-- { request_id } ----------|
  |                           | (signed httpOnly cookie)    |
  |<-- { ok: true } ----------|                            |
  |                           |                            |
  | (user enters code)        |                            |
  |                           |                            |
  |-- POST /api/auth/phone/verify (code) -->               |
  |                           | (reads cookie → requestId) |
  |                           |-- checkVerificationStatus -->|
  |                           |<-- { status: code_valid } --|
  |                           | upsert user in Neon        |
  |                           | set tg_session JWT cookie  |
  |<-- { ok: true } ----------|                            |
  | redirect → /              |                            |
```

### Rate limits
- **Send OTP:** 3 запроса / 10 минут на номер
- **Verify code:** 5 попыток / 10 минут на номер
- Telegram Gateway дополнительно ограничивает попытки ввода кода

### Безопасность
- `request_id` никогда не передаётся клиенту — хранится в signed httpOnly JWT cookie
- Код верификации не хранится в БД — Telegram управляет им сам
- `tg_session` — httpOnly, Secure, SameSite=Lax, 30 дней
- Все API-роуты проверяют авторизацию перед любой операцией с данными

---

## Структура проекта

```
app/
  api/
    auth/
      [...nextauth]/   — NextAuth handler (email/password)
      phone/
        send/          — POST: отправить OTP через Telegram Gateway
        verify/        — POST: проверить код, создать сессию
        logout/        — POST: удалить tg_session cookie
      register/        — POST: регистрация по email
    tasks/             — CRUD задач (GET, POST, DELETE completed)
    tasks/[id]/        — PATCH, DELETE задачи
    categories/        — CRUD категорий
    categories/[id]/   — DELETE категории
  login/               — Страница авторизации
lib/
  telegram-gateway.ts  — Клиент Telegram Gateway API
  phone-verify-cookie.ts — Подпись/валидация verify cookie
  phone-rate-limit.ts  — Rate limiting в Neon
  get-user-id.ts       — Универсальный auth хелпер (email + phone)
scripts/
  init-db.mjs          — Создание таблиц + первый пользователь
  migrate-phone.mjs    — Миграция для phone auth
```

---

## Первый пользователь (email)

Создан скриптом `init-db.mjs`:
- Email: `username@gmail.com`
- Пароль: `TmpPassword123`

Смени пароль после первого входа.
