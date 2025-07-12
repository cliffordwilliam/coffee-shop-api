# API Response Standard

This document outlines the standardized structure for API responses across all CRUD operations. The format ensures consistency, clarity, and future extensibility using the `success`, `data`, `meta`, and `error` fields.

---

## 📦 General Response Format

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

- `success` (`boolean`): Indicates whether the request was processed successfully.
- `data` (`object | array | null`): Contains the main response payload.
- `meta` (`object`, optional): Holds auxiliary information such as pagination.
- `error` (`object`, only present if `success: false`): Describes the error encountered.

---

## 🔁 CRUD Response Patterns

### 📖 GET: Retrieve

#### ➤ Single Resource (e.g., `GET /guest/{id}`)

```json
{
  "success": true,
  "data": {
    "GuestId": "uuid",
    "FirstName": "John"
  }
}
```

#### ➤ Multiple Resources (e.g., `GET /guests`)

```json
{
  "success": true,
  "data": [
    { "GuestId": "uuid", "FirstName": "John" },
    { "GuestId": "uuid", "FirstName": "Jane" }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "size": 10,
      "total": 42
    }
  }
}
```

### ➕ POST: Create

```json
{
  "success": true,
  "data": {
    "GuestId": "uuid",
    "FirstName": "John"
  }
}
```

### ✏️ PUT/PATCH: Update

```json
{
  "success": true,
  "data": {
    "GuestId": "uuid",
    "FirstName": "John Updated"
  }
}
```

### ❌ DELETE: Remove

```json
{
  "success": true
}
```

---

## ⛔ Error Handling

### ⚠️ General Error Format

```json
{
  "success": false,
  "error": {
    "message": "Validation error",
    "code": 1234,
    "details": [
      {
        "field": "guest_name",
        "message": "Guest Name is required."
      },
      {
        "field": "guest_birth_date",
        "message": "Guest Birth Date must be less than today."
      }
    ]
  }
}
```

- `message` (`string`, required): A human-readable explanation of the error.
- `code` (`number`, optional): A custom application-specific error code.
- `details` (`array`, optional): Field-level validation or error messages.

---

## 🧾 Special Cases

### 📭 Empty Lists

For GET requests returning no items, use an empty array with accurate pagination metadata.

```json
{
  "success": true,
  "data": [],
  "meta": {
    "pagination": {
      "page": 1,
      "size": 10,
      "total": 0
    }
  }
}
```

### 🚫 Null Resources

If a specific resource is not found or is intentionally `null`, return:

```json
{
  "success": false,
  "error": {
    "message": "Guest not found."
  }
}
```

> Note: `success` should be `false` when no resource is found, even if the request itself was valid.

### 🕳️ Optional Fields

Optional fields with no value should be explicitly returned as `null` rather than omitted:

```json
{
  "success": true,
  "data": {
    "GuestId": "uuid",
    "MiddleName": null
  }
}
```

---

## ✅ Summary

| Field     | Type                        | Description                                   |
| --------- | --------------------------- | --------------------------------------------- |
| `success` | `boolean`                   | Indicates operation success                   |
| `data`    | `object` / `array` / `null` | Main payload (varies by endpoint)             |
| `meta`    | `object` (optional)         | Additional context (e.g., pagination info)    |
| `error`   | `object` (if error)         | Describes failure reason and optional details |
