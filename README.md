# AST Rule Engine Project
## Project Overview
This project is a rule engine that uses an **Abstract Syntax Tree (AST)** to represent and evaluate conditional rules.The system allows users to:
- Create and modify rules dynamically.
- Combine multiple rules using logical operators (AND/OR).
- Evaluate rules against provided data.
- Modify operators, operands, and sub-expressions within the AST.
- Manage rules through a simple frontend UI with pagination and time display in IST (Indian Standard Time).

## Features
- **Create Rules**: Enter a rule string and generate its AST representation.
- **Modify Rules**: Modify the operands, operators, or sub-expressions of existing rules.
- **Evaluate Rules**: Evaluate the AST representation of a rule against user data.
- **Pagination**: Display and paginate through saved rules.
- **Frontend UI**: A user-friendly interface for rule management.
## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB (for storing rules)
- **Frontend**: React.js
- **Testing**: Jest (for testing backend logic and API routes)
- **Other Libraries**: 
  - `axios` for API requests
  - `mongoose` for MongoDB connection
  - `node-cron` for scheduled operations (if applicable)
  - `cors` for cross-origin requests in development
## Prerequisites

Ensure you have the following installed on your system:
- **Node.js** (v12 or higher)
- **MongoDB** (Running locally or using MongoDB Atlas)
- **npm** (comes with Node.js)
## Setup and Installation
- Clone the repository

```bash
git clone https://github.com/rohithk2001/RULE-ENGINE-AST.git
cd rule-engine-ast

```
###  Backend Setup: 

- Install Dependencies:

```bash
npm install

```
- Start the Backend Server

```bash 
npm start
```

### Frontend Setup
- Open new terminal
- Navigate to Frontend: 
```bash
cd rule-engine-ast
```
```bash
cd ruleenginefrontend

```
- Install Dependencies:

```bash
npm install

```
- Start the frontend server:
```bash 
npm start
```


## MongoDb setup
- If you're using MongoDB locally, ensure MongoDB is running. If using MongoDB Atlas, update the connection string in the db.js file.

```js
 mongoose.connect('mongodb://localhost:27017/ruleEngineDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

```
- To keep things simple i have used the local databases

- If using MongoDB Atlas, replace 'mongodb://localhost:27017/ruleEngineDB' with your connection string.
## Usage

- when you start running the front-end i.e. react app you will see the input regions for the particular feilds.

- we can send the data in the json format & Evaluate rules against provided data.

- Modify operators, operands, and sub-expressions within the AST.
## API Reference

- use postman set the request to post send the data in raw json mode in the Body 

#### Create Rule
```http
POST /create-rule
```

section 
```bash
Body: json
 { 
  "ruleString": "age > 30"
 }
```
- Description: Creates a new rule and returns its Abstract Syntax Tree (AST) representation.

#### Combine Rules
```http 
 POST /combine-rules
```
Body: json
```bash
{ 
  "rule1": AST_object, 
  "rule2": AST_object, 
  "operator": "AND" 
}
```

- Description: Combines two rules using the specified operator (AND, OR, etc.).

#### Evaluate Rule
```http 
POST /evaluate-rule
```
Body: json

```bash
{ 
  "ast": AST_object, 
  "data": { "age": 35, "salary": 60000 } 
}
```
- Description: Evaluates a rule's AST against provided user data.

#### Modify Rule
```http
 POST /modify-rule
```
Body:json
```bash
{ 
  "ruleId": "rule_id", 
  "modificationType": "operator/operand", 
  "newValue": "age < 25", 
  "side": "left/right" 
}
```
- Description: Modifies an existing rule by updating an operator or operand.

#### Modify Sub-Expression
```http
 POST /modify-subexpression
```
Body:json
```bash
{ 
  "ruleId": "rule_id", 
  "action": "add/remove", 
  "subExpression": "salary > 50000", 
  "operator": "AND", 
  "side": "left/right" 
}
```
- Description: Adds or removes a sub-expression from a rule, specifying the logical operator and side.

#### Get All Rules
```http
 GET /rules
```
- Description: Fetches all saved rules.

## Testing

- The project uses Jest for testing the backend logic and API routes.
- Before you start Testing remove " app.test.js " from the "ruleenginefrontend/src"
```bash
 npm test
```

## Contributing

- Contributions are welcome! Please fork the repository and submit a pull request for any improvements or features you'd like to add.
