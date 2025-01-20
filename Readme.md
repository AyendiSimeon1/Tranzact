# Tranzact API Documentation

## Overview
Tranzact is a simple wallet system built with Node.js, Express, and MongoDB, following object-oriented programming principles. The API allows users to manage digital wallets, wallet types, and perform money transfers.

Base URL: `localhost:3000/api`



## Endpoints

### Users

#### Get All Users
- **Method**: GET
- **Endpoint**: `/users`
- **Description**: Retrieves a list of all users in the system
- **Response**: 200 OK
```json
[
  {
    "id": "string",
    "name": "string",
    
  }
]
```

### Wallet Types

#### Get All Wallet Types
- **Method**: GET
- **Endpoint**: `/walletTypes`
- **Description**: Retrieves a list of all available wallet types
- **Response**: 200 OK
```json
[
  {
    "id": "string",
    "name": "string",
    "minimumBalance": "number",
    "monthlyInterestRate": "number"
  }
]
```

#### Create Wallet Type
- **Method**: POST
- **Endpoint**: `/walletTypes`
- **Description**: Creates a new wallet type
- **Request Body**:
```json
{
  "name": "string",
  "minimumBalance": "number",
  "monthlyInterestRate": "number"
}
```
- **Response**: 200 OK
```json
{
  "id": "string",
  "name": "string",
  "minimumBalance": "number",
  "monthlyInterestRate": "number"
}
```

#### Get Wallet Type by ID
- **Method**: GET
- **Endpoint**: `/walletTypes/:id`
- **Description**: Retrieves a specific wallet type by ID
- **Parameters**:
  - `id`: Wallet type identifier
- **Response**: 200 OK
```json
{
  "id": "string",
  "name": "string",
  "minimumBalance": "number",
  "monthlyInterestRate": "number"
}
```

#### Update Wallet Type
- **Method**: PUT
- **Endpoint**: `/walletTypes/:id`
- **Description**: Updates an existing wallet type
- **Parameters**:
  - `id`: Wallet type identifier
- **Request Body**:
```json
{
  "name": "string",
  "minimumBalance": "number",
  "monthlyInterestRate": "number"
}
```
- **Response**: 200 OK
```json
{
  "id": "string",
  "name": "string",
  "minimumBalance": "number",
  "monthlyInterestRate": "number"
}
```

#### Delete Wallet Type
- **Method**: DELETE
- **Endpoint**: `/walletTypes/:id`
- **Description**: Deletes a wallet type
- **Parameters**:
  - `id`: Wallet type identifier
- **Response**: 204 No Content

### Wallets

#### Create Wallet
- **Method**: POST
- **Endpoint**: `/wallets`
- **Description**: Creates a new wallet for a user
- **Request Body**:
```json
{
  "userId": "string",
  "typeId": "string",
  "initialBalance": "number"
}
```
- **Response**: 200 OK
```json
{
  "id": "string",
  "userId": "string",
  "typeId": "string",
  "balance": "number"
}
```

#### Get All Wallets
- **Method**: GET
- **Endpoint**: `/wallets`
- **Description**: Retrieves a list of all wallets
- **Response**: 200 OK
```json
[
  {
    "id": "string",
    "userId": "string",
    "typeId": "string",
    "balance": "number"
  }
]
```

#### Get Wallet Details
- **Method**: GET
- **Endpoint**: `/wallets/:id`
- **Description**: Retrieves details of a specific wallet
- **Parameters**:
  - `id`: Wallet identifier
- **Response**: 200 OK
```json
{
  "id": "string",
  "userId": "string",
  "typeId": "string",
  "balance": "number"
}
```

### Transfers

#### Transfer Money
- **Method**: POST
- **Endpoint**: `/transfer`
- **Description**: Transfers money between two wallets
- **Request Body**:
```json
{
  "fromWalletId": "string",
  "toWalletId": "string",
  "amount": "number"
}
```
- **Response**: 200 OK
```json
{
  "id": "string",
  "fromWalletId": "string",
  "toWalletId": "string",
  "amount": "number",
  "timestamp": "string"
}
```

## Error Handling

The API returns standard HTTP status codes to indicate the success or failure of requests:

- `200 OK`: Request successful
- `204 No Content`: Request successful (for DELETE operations)
- `400 Bad Request`: Invalid request parameters
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error Response Format:
```json
{
  "error": "Error message description"
}
```