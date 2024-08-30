# Northcoders House of Games API

NC Games API
Built By Kirsty Butterworth

## **Back-End**

Back-end - Hosted link:

## **Front-End**

Front-End - Hosted link:
Front-End - Github link:

## **Description**

'NC-Games API' is an API built using Node.js, Express.js and a PostgreSQL database.

You can view the API endpoints in the endpoints.json file or by going to <LINK> which lists all available endpoints and how they can be interacted with.

# **Setup / Installation Instructions**

### **Requirements:**

Node.js 17.x
Postgres 14.x

### **dependencies:**

Application dependencies and versions can be found in the package.json file.

### **Cloning the repository:**

In your terminal:
$ git clone <link>
$ cd be-nc-games

### **Installing dependencies:**

Initializing Node by installing the required dependencies from package.json. In your terminal:
$ npm install

### **Environment setup:**

- You will need to create _two_ `.env` files for the app: `.env.test` and `.env.development`. Into each, add `PGDATABASE = nc_games` for the `.env.development` file and `PGDATABASE = nc_games_test` for the `.env.test` file.

### **Database set-up and seeding:**

- To begin testing or using this app, you will need to setup the database seed it with data:

```
$ npm run setup-dbs
$ npm run seed
```

# **Testing**

- `Jest` is the framework used to test this application.
- To run tests:

```
$ npm run test
```
