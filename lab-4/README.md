# Лабораторна 4: GoF Strategy для виводу даних

Реалізація читає датасет `ParkingViolationCodes_March_2024.xlsx` та виводить записи у вибране сховище через патерн Strategy.

## Що реалізовано

- Вичитка даних з XLSX (`ExcelDataReader`).
- Відокремлений шар виводу (`IOutputStrategy`).
- 4 стратегії виводу:
  - `ConsoleOutputStrategy`
  - `FileOutputStrategy`
  - `KafkaOutputStrategy`
  - `RedisOutputStrategy`
- Перемикання стратегії тільки через конфіг (`lab-4/config/app.config.json`).

## Запуск

```bash
npm run lab-4:start
```

## Налаштування Redis і Kafka

Підняти обидва сервіси можна через Docker Compose:

```bash
docker compose -f ./lab-4/docker-compose.yml up -d
```

Зупинити сервіси:

```bash
docker compose -f ./lab-4/docker-compose.yml down
```

Поточний конфіг `lab-4/config/app.config.json` вже сумісний з цим compose-файлом:

- Redis: `redis://localhost:6379`
- Kafka broker: `localhost:9092`
- Kafka topic: `parking-violations`

Для запуску через WSL можна використати:

```bash
sudo docker compose -f /mnt/c/Users/admin/Desktop/iot_dpz/lab-4/docker-compose.yml up -d
sudo docker compose -f /mnt/c/Users/admin/Desktop/iot_dpz/lab-4/docker-compose.yml ps
```

## Налаштування без Docker Desktop (Windows)

### Redis (локально через winget)

```bash
winget install -e --id Memurai.MemuraiDeveloper
```

Після встановлення сервіс Redis стартує автоматично на `localhost:6379`.

Перевірка:

```bash
redis-cli ping
```

Очікувано: `PONG`.

## Перемикання виводу без змін коду

Змініть поле `output.strategy` у `lab-4/config/app.config.json`:

- `"console"`
- `"file"`
- `"kafka"`
- `"redis"`

Та налаштуйте секцію відповідної стратегії (`console`, `file`, `kafka`, `redis`).

## Приклад

```json
{
  "output": {
    "strategy": "file",
    "file": {
      "outputPath": "./lab-4/output/parking-violations.jsonl"
    }
  }
}
```
