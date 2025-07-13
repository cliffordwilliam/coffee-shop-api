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
    INT stockQuantity
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
    INT addressId FK
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

  PAYMENT {
    INT id PK
    INT orderId FK
    STRING provider
    STRING status
    STRING paymentIntentId
    DATETIME paidAt
  }

  CART {
    INT id PK
    INT userId FK
    DATETIME createdAt
  }

  CART_ITEM {
    INT id PK
    INT cartId FK
    INT coffeeId FK
    INT quantity
  }

  ADDRESS {
    INT id PK
    INT userId FK
    STRING street
    STRING city
    STRING postalCode
    STRING country
  }

  USER ||--o{ ORDER : places
  ORDER ||--|{ ORDER_ITEM : contains
  COFFEE ||--o{ ORDER_ITEM : is_part_of
  CATEGORY ||--|{ COFFEE : includes
  USER ||--|| CART : owns
  CART ||--|{ CART_ITEM : holds
  COFFEE ||--o{ CART_ITEM : is_in
  ORDER ||--|{ PAYMENT : has
  USER ||--|{ ADDRESS : has
  ORDER }|--|| ADDRESS : ships_to
```

---

## 🗂 Example Use Cases Mapped to ERD

| Use Case                        | Tables Involved                                              |
| ------------------------------- | ------------------------------------------------------------ |
| Customer registers              | `User`                                                       |
| Admin adds new coffee           | `Coffee`, `Category`                                         |
| Customer places order           | `User`, `Order`, `OrderItem`, `Coffee`, `Address`, `Payment` |
| Add item to cart                | `User`, `Cart`, `CartItem`, `Coffee`                         |
| Checkout and pay                | `Cart`, `CartItem`, `Order`, `OrderItem`, `Payment`          |
| Track stock availability        | `Coffee`                                                     |
| Filter coffee by category       | `Coffee`, `Category`                                         |
| View past orders                | `User`, `Order`, `OrderItem`                                 |
| Admin updates product inventory | `Coffee`                                                     |
| Customer updates address        | `Address`, `User`                                            |
