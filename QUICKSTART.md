# Швидкий старт для Lab 2

## Крок 1: Встановлення залежностей

```powershell
npm install
```

## Крок 2: Генерація CSV файлу з даними

```powershell
npm run generate-csv
```

Це створить файл `data/reviews.csv` з 1000 рядками даних.

## Крок 3: Імпорт даних в базу даних

```powershell
npm run import-data
```

Це:

- Створить SQLite базу даних `database.sqlite`
- Зчитає дані з CSV файлу
- Створить користувачів, ресторани, готелі
- Створить відгуки з правильними зв'язками
- Обчислить середні рейтинги

## Альтернативні команди

### Генерація CSV з власною кількістю рядків

```powershell
npx ts-node src/utils/csvGenerator.ts 2000
```

### Імпорт з власного CSV файлу

```powershell
npm run dev path/to/your/file.csv
```

### Компіляція TypeScript

```powershell
npm run build
```

### Запуск скомпільованого коду

```powershell
npm start
```

## Структура даних в CSV

Файл містить всі дані в одному файлі:

- Користувачі (username, userEmail)
- Ресторани/Готелі (entityType, entityName, entityAddress, cuisineType/stars)
- Відгуки (comment, rating, date, status)

## Перевірка даних

Після імпорту ви можете відкрити `database.sqlite` будь-яким SQLite клієнтом для перевірки даних.

Таблиці:

- `user` - користувачі
- `reviewable_entity` - базова таблиця для ресторанів та готелів
- `review` - відгуки

## Очистка та повторний імпорт

Щоб повторити імпорт:

1. Видалити `database.sqlite`
2. Запустити `npm run import-data`
