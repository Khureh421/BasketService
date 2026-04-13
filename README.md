# Overview
Catalog book service for SEN300 class.
Auth not implemented.

## Clone to your directory
```git
git clone https://github.com/Khureh72/CatalogService.git
```

## Download Dependencies
```npm
npm install
```

## Run Locally
```npm
npm start
```

## Dockerize
```
docker compose up --build
```

## Object Example
```json
{
    "title": "My 100th book",
    "author": "Chris",
    "description":"This took a lot of time",
    "price" : 5.56
}
```

## End Points
```
http://localhost:3000/books/
```
- GET - Gets all books with optional query parameters.
- POST - Creates book with JSON body sent in.
```
http://localhost:3000/books/:id
```
- GET - Gets book with id given.
- PUT - Updates all book properties with id given.
- DELETE - Deletes book with id given.
