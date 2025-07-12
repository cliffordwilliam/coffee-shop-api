# 📊 Entity Relationship Diagram: Coffee Shop

```mermaid
erDiagram

  USER {
    INT id PK
    STRING email
    STRING name
    STRING passwordHash
    STRING role
    DATETIME createdAt
  }

  COFFEE {
    INT id PK
    STRING name
    STRING description
    FLOAT price
    INT categoryId FK
    DATETIME createdAt
    DATETIME updatedAt
  }

  CATEGORY {
    INT id PK
    STRING name
  }

  ORDER {
    INT id PK
    INT userId FK
    DATETIME createdAt
    STRING status
  }

  ORDER_ITEM {
    INT id PK
    INT orderId FK
    INT coffeeId FK
    INT quantity
    FLOAT priceAtPurchase
  }

  USER ||--o{ ORDER : places
  ORDER ||--|{ ORDER_ITEM : contains
  COFFEE ||--o{ ORDER_ITEM : is_part_of
  CATEGORY ||--|{ COFFEE : includes
```

---

## 🗂 Example Use Cases Mapped to ERD

| Use Case                  | Tables Involved                        |
| ------------------------- | -------------------------------------- |
| Customer registers        | `User`                                 |
| Admin adds new coffee     | `Coffee`, `Category`                   |
| Customer places order     | `User`, `Order`, `OrderItem`, `Coffee` |
| Filter coffee by category | `Coffee`, `Category`                   |
