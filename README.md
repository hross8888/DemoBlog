# 📝 Demo Blog

Полноценный фуллстек-блог с авторизацией и JWT.  
Сделан на стеке Django + Django Ninja + Redis + PostgreSQL (бэкенд) и React + MUI (фронт).

---

## 📦 Стек

### Backend
- Python 3.13
- Django 5.2 + django-ninja
- Pydantic
- PostgreSQL
- Redis (для контроля доступа по JTI)
- Poetry для зависимостей

### Frontend
- React.js (JavaScript)
- Material UI
- Axios
- MobX
- Vite

---

## 🚀 Запуск

### 🔧 Backend (локально)

```bash
cd backend
poetry install
cp .env.example .env  # заполните настройки базы и JWT
poetry run python manage.py migrate
poetry run python manage.py runserver
```

### 🌐 Frontend
```bash
cd frontend
npm install
npm run dev
```

### 📍 Prod
```bash
git clone...
chmod 744 DemoBlog/backend/entrypoint.sh
cd DemoBlog/infra
chmod 744 get-docker.sh
./get-docker.sh
cp .env.example .env # заполните настройки базы и JWT
docker compose up --build
```

## 🔐 Авторизация
JWT access токен (без refresh)

JTI хранится в Redis + БД (JWTToken)

Logout удаляет JTI

Авторизация через кастомный AuthBearer


## 📃 Возможности
Регистрация / вход

Создание и удаление постов и комментариев (только своих)

Лайки / дизлайки

Разворачиваемый блок комментариев (с подгрузкой)

Админка Django с фильтрами и поиском


## ✅ Покрытие ТЗ
 Одна страница с блогом

 JWT авторизация

 Django Ninja + Pydantic

 PostgreSQL / Redis

 Docker-ready

 PEP8, типизация, изоляция слоёв


##### Проект выполнен в рамках тестового задания, но с прицелом на боевое качество.
