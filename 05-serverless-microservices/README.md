# Project 05 – Serverless Microservices: Secure Notes Application

- This project implements a secure and scalable serverless microservices backend on AWS using fully managed cloud services.

- The system follows a **backend-first, microservices-based approach**, where authentication, authorization, and core application logic are handled by independent AWS serverless components.

- It is a **Serverless Microservice-Oriented Notes Platform**, where authenticated users can create, organize, archive, and lock notes with strict user-level data isolation. The frontend is deployed using **AWS Amplify**, while the backend operates independently using AWS serverless services.

- The backend is reusable and can be integrated with **any frontend application** by following the setup instructions below.

---

## Project Objectives

- Build a serverless microservices backend using AWS managed services.     
- Implement user authentication and authorization using Amazon Cognito.
- Expose protected RESTful APIs using Amazon API Gateway.
- Ensure strict user-level data isolation using Amazon DynamoDB.
- Enable any frontend application to securely use the backend services.

---

## Architecture

```
User (Browser)
     |
     |  HTTPS
     v
React Frontend
(AWS Amplify Hosting)
     |
     |  Login / Signup
     |  (JWT Token Issued)
     v
Amazon Cognito
(Authentication & Authorization)
     |
     |  JWT Token
     v
Amazon API Gateway
(Authorizer: Cognito)
     |
     |  Based on API route and HTTP method
     v
AWS Lambda Microservices
(Create / Read / Update / Delete Notes)
     |
     |  
     v
Amazon DynamoDB
```

## AWS Services Used

- **Amazon Cognito** – User authentication and authorization
- **Amazon API Gateway** – Secure REST API endpoints
- **AWS Lambda** – Serverless backend microservices
- **Amazon DynamoDB** – User-isolated NoSQL data storage
- **AWS IAM** – Permissions and secure service access 
- **AWS Amplify** – Frontend deployment (optional)
- **React** – Frontend user interface framework

---

## Microservices Design
Each backend operation is implemented as an independent AWS Lambda function.
### Notes Microservice
- `SecureNotes-CreateNote` – Create a new note for the authenticated user
- `SecureNotes-GetNotes` – Fetch all notes belonging to the user  
- `SecureNotes-UpdateNote` – Update an existing note  
- `SecureNotes-DeleteNote` – Delete a note

  **Each microservice:**
  - Receives a JWT token from API Gateway
  - Extracts the authenticated user ID
  - Operates only on the authenticated user’s data

### Security Microservice
- `SecureNotes-LockedSection` – Manage locked notes and security verification  
(This microservice is protected by Amazon Cognito and handles locked section security.)

### API Authentication
- All API requests are secured using Amazon Cognito and an API Gateway Cognito Authorizer.  
- The frontend handles token management automatically using AWS Amplify.

---


## Prerequisites

- AWS Account
- Node.js 18+
- npm
- Git

---

## How to Use This Project
There are **two ways** to use this project:

### Option 1: Use the Provided Frontend  
Run the included Secure Notes React application and connect it to AWS.

### Option 2: Use your Own Frontend  
If you already have a frontend application, you can reuse only the backend services:
- Cognito
- API Gateway
- Lambda
- DynamoDB

---

## Backend Setup

### Authentication – Amazon Cognito
- Open **AWS Console → Amazon Cognito**
- Click **Create user pool**
- Application Type: **Single-page application (SPA)**
- Name: `secure-notes-web-app`
- **Sign-in options**
  - Choose Email
  - Enable self sign-up
  - Required attribute: email
- **Save the following values**
  - **User Pool ID**
  - **App Client ID**
  - **AWS Region**

### Authentication Flows
- Navigate to **secure-notes-web-app → App clients → Edit**
- Enable the following in the App Client:
  - ALLOW_USER_SRP_AUTH
  - ALLOW_USER_PASSWORD_AUTH
  - ALLOW_ADMIN_USER_PASSWORD_AUTH
  - ALLOW_REFRESH_TOKEN_AUTH
- These Authentication flows are required for:
  - User login
  - Token refresh
  - Account verification during locked password reset

---

### Database – Amazon DynamoDB 

**Table 1: Notes Data**
- Table name: `SecureNotesTable`
- Partition key: `userId` (String)
- Sort key: `noteId` (String)
- Billing mode: On-demand

**Table 2: Locked Section Security**
- Table name: `UserSecuritySettings`
- Partition key: `userId` (String)
  
---

### Microservices – AWS Lambda
Create the following Lambda functions:

- `SecureNotes-CreateNote`
- `SecureNotes-GetNotes`
- `SecureNotes-UpdateNote`
- `SecureNotes-DeleteNote`
- `SecureNotes-LockedSection`

**Configuration**
- Runtime: Python 3.x
- Architecture: x86_64
- Each Lambda function uses an AWS-managed Lambda execution role with basic permissions.

Each Lambda function extracts the authenticated user ID from the Cognito JWT token:
```python
user_id = event["requestContext"]["authorizer"]["claims"]["sub"]
```

---

### IAM Permissions

#### Notes Microservices Access

- Create an IAM policy named `SecureNotes-DynamoDB-Access` and attach it to **each Notes Lambda execution role.**
  
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem"
      ],
      "Resource": "arn:aws:dynamodb:us-east-1:*:table/SecureNotesTable"
    }
  ]
}
```
- Verify that each Notes Lambda execution role has these policies attached:
```yaml
 SecureNotes-DynamoDBAccess
 AWSLambdaBasicExecutionRole
```


#### User Security Microservice Access

- The `SecureNotes-LockedSection` Lambda function requires access to both **Amazon DynamoDB** and **Amazon Cognito**.

**1. DynamoDB Access Policy**

Create an IAM policy named `UserSecuritySettings-LambdaAccess` and attach it to the execution role of `SecureNotes-LockedSection`.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:DeleteItem",
        "dynamodb:UpdateItem",
        "dynamodb:Scan",
        "dynamodb:Query"
      ],
      "Resource": "arn:aws:dynamodb:us-east-1:*:table/UserSecuritySettings"
    }
  ]
}
```

**2. Cognito Access Policy**

Create an IAM policy named `UserSecurity-CognitoVerifyAccess` and attach it to the `SecureNotes-LockedSection`

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "cognito-idp:AdminInitiateAuth",
      "Resource": "arn:aws:cognito-idp:us-east-1:060768936919:userpool/us-east-1_CApEVW0KO"
    }
  ]
}
```

-  Verify that the **execution role** of the `SecureNotes-LockedSection` Lambda function has the following policies attached:
  ```yaml
  UserSecuritySettings-LambdaAccess
  UserSecurity-CognitoVerifyAccess
  AWSLambdaBasicExecutionRole 
  ```

**Note:** After verifying the attached policies, open each Lambda function in the AWS Console, go to the Code section, and upload the corresponding function code from the `/backend directory`.

---


### Amazon API Gateway – API Routing  

#### Create REST API

- Create a REST API named `SecureNotes-API`
- Endpoint type: **Regional**


**Common settings for all methods**
- Integration type: **Lambda Function**
- Authorization: **Cognito Authorizer**

**Create `/notes` Resource and attach methods:**
  - **GET** → Lambda function: `SecureNotes-GetNotes`
  - **POST** → Lambda function: `SecureNotes-CreateNote`
  - **PUT** → Lambda function: `SecureNotes-UpdateNote`
  - **DELETE** → Lambda function: `SecureNotes-DeleteNote`

**Create /security/locked Resource and attach methods:**
- Path: `/security/locked` 
- **GET** → Lambda function: `SecureNotes-LockedSection`
- **POST** → Lambda function: `SecureNotes-LockedSection`

#### Create Cognito Authorizer

- Go to **SecureNotes-API → Authorizers → Create authorizer**
- Authorizer type	**Cognito**
- Name: `SecureNotes-CognitoAuthorizer`
- Cognito user pool: **secure-notes-web-app**
- Token source: **Authorization**
- **Attach authorizer to all API methods**


#### Enable CORS and Deploy API

- Enable CORS on both Resources
  - `/notes`
  - `/security/locked`
- Allowed methods: `GET, POST, PUT, DELETE, OPTIONS`
- Allowed headers: `Authorization, Content-Type`
- Deploy API
- Stage name: `dev`

**Save the Invoke URL.**

---


## Frontend Setup
#### Option A: Clone Existing Frontend
1. Clone the repository, Install dependencies and start the frontend locally:
```bash
git clone https://github.com/saikoushikchepyala1/Cloud-Devops-Projects.git
cd Cloud-Devops-Projects/05-serverless-microservices/frontend
npm install
```
- This will install all dependencies listed in package.json and start the frontend locally.
#### Local Testing Flow
- Start frontend locally
  ```bash
  npm start
  ```
- Application runs at: http://localhost:3000
- Sign up / sign in using Cognito
- Perform CRUD operations on notes web application
- Verify:
  - Lambda logs
  - DynamoDB data
  - API Gateway responses

---

#### Option B: Create Your Own Frontend
- If you already have a React frontend or want to create a new one, follow these steps:
- Navigate to your project directory

1. Create a new React project
```bash
npx create-react-app frontend
cd frontend
```
2. Install required dependencies to connect your frontend with AWS backend and for UI components:
```bash
npm install aws-amplify @aws-amplify/ui-react lucide-react react-icons
```
3. Configure AWS Amplify in your React app:
- Create `src/amplifyConfig.js`
```javascript
import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      region: "<AWS_REGION>",
      userPoolId: "<USER_POOL_ID>",
      userPoolClientId: "<APP_CLIENT_ID>",
      loginWith: { email: true }
    }
  }
});
```
- Import this configuration in your main entry file (index.js):
```javascript
import './amplifyConfig';
```
4. Connect your frontend to the backend API:
- Update notesApi.js (or your API file) with the API Gateway Invoke URL:
```javascript
const API_BASE_URL = "<API_INVOKE_URL>";
```
5. Start the frontend locally and access the application at: http://localhost:3000

---


## Deployment (AWS Amplify)
- Push frontend directory to GitHub 
- Connect repository in AWS Amplify
- Select frontend directory
- Frontend build command:
```bash
npm run build
```
- Output directory: `build`
```yaml
version: 1
applications:
  - frontend:
      phases:
        preBuild:
          commands:
            - npm install
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: build
        files:
          - "**/*"
      cache:
        paths:
          - node_modules/**/*
    appRoot: 05-serverless-microservices/frontend
```
- Build and deploy
- Amplify automatically:
  - Builds React app
  - Hosts it
  - Provides a public URL

### After Deployment

- Open the Amplify-provided URL in the browser  
- Sign up or sign in using Amazon Cognito  

### Verify

- Notes can be created, updated, archived, locked, and deleted  
- API requests are authorized using Cognito JWT tokens  
- Data is stored and retrieved securely from DynamoDB  

### Continuous Deployment

Any future changes pushed to the connected GitHub branch will automatically trigger a new build and deployment in AWS Amplify.

---