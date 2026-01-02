# Serverless Guestbook Application on AWS

This project demonstrates how to build a **fully serverless guestbook web application on AWS** using managed cloud services.
Users can submit and view messages through a web interface without managing any servers.

The entire backend is serverless, scalable, and cost-efficient.

---


## Project Overview

In this project, we build a simple guestbook application where:

- Users enter their name and message through a web UI
- Messages are sent to a serverless backend
- Data is stored securely in Amazon DynamoDB
- Messages are fetched and displayed on demand
- The frontend is hosted using Amazon S3 static website hosting

AWS automatically handles scaling, availability, and infrastructure.

---

## Architecture Overview

```text
User (Browser)
     |
     |  HTTPS
     v
S3 Static Website (Frontend)
     |
     |  REST API Calls
     v
Amazon API Gateway
     |
     |  Invoke
     v
AWS Lambda Functions
     |
     |  Read / Write
     v
Amazon DynamoDB

```

---

## AWS Services & Technologies Used

- Amazon S3 – Host the frontend (HTML, CSS, JavaScript)
- Amazon API Gateway – Expose REST APIs
- AWS Lambda – Serverless backend logic (Python)
- Amazon DynamoDB – NoSQL database for guestbook messages
- IAM Roles & Policies – Secure service-to-service access


---


## Step-by-Step Implementation

### Step 1: Create DynamoDB Table

- Table name: `guestbook-table`
- Partition key:
  - Name: `id`
  - Type: `String`
- Leave all other settings as default
- Click Create table

**Result:** DynamoDB table is ready to store all guestbook messages.

---

### Step 2: Create IAM Role for Lambda

- Go to IAM → Roles → Create role
- Trusted entity:
  - AWS service
  - Use case: `Lambda`
- Permissions:
  - Attach policy: `AmazonDynamoDBFullAccess`
- Role name: `lambda-guestbook-role`
- Click Create role

**Result:** Lambda can securely access DynamoDB without credentials.

---

### Step 3: Create Lambda Functions

#### 1. To handle POST requests to store new messages

**Configure:**
- Function name: `guestbook-add-message`
- Runtime: `Python 3.x`
  
**Permissions:**
- Use existing role: `lambda-guestbook-role`
  
**Replace default code with:**
- `lambdas/guestbook-add-message.py`

#### 2. To handle GET requests to retrieve messages

**Configure:**
- Function name: `guestbook-get-message`
- Runtime: `Python 3.x`

**Permissions:**
- Use existing role: `lambda-guestbook-role`
  
**Replace default code with:**
- `lambdas/guestbook-get-message.py`

**NOTE:** Both files are available in the /lambdas directory.

**Result:** Two AWS Lambda functions are created—one to securely store guestbook messages in DynamoDB (POST) and one to retrieve stored messages (GET).

---

### Step 4: Create API Gateway

- Choose: `REST API`
- API name: `serverless-guestbook-api`
- Create resource:
  - Resource name: `messages`
  - Resource path: `/messages`
- Create methods:
  - **POST → Lambda →** `guestbook-add-message`
  - **GET → Lambda →** `guestbook-get-message`
- Enable CORS on the `/messages` resource for both GET and POST methods
- Deploy API: **Stage name:** `prod`
- Note the **Invoke URL** available in the Stage details.

**Result:** Public REST endpoints are available.

---

### Step 5: Build Frontend UI

- All frontend files (HTML, CSS, JavaScript) are organized inside the `frontend/` directory.
- Update the `API_URL` value in `script.js` with your `API Gateway Invoke URL`.
- Make sure the URL ends with the `/messages` resource path.
- **Example:** ```https://<api-id>.execute-api.<region>.amazonaws.com/prod/messages```


**Result:** Frontend UI is ready and successfully connected to the serverless backend.


---

### Step 6: Host Frontend on S3

- Bucket name: `aws-serverless-guestbook-frontend`
- Disable **Block all public access**
- Open the created bucket **→ Properties**:
  - Enable **Static website hosting**
  - Index document: `index.html`
  - Save changes
- Upload all files from `frontend/` directory
- Add **Bucket Policy** for public access
  - Go to Permissions → Bucket policy
  - Paste the following policy:
    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
          {
              "Sid": "PublicReadAccess",
              "Effect": "Allow",
              "Principal": "*",
              "Action": "s3:GetObject",
              "Resource": "arn:aws:s3:::aws-serverless-guestbook-frontend/*"
          }
      ]
    }

    ```

- Access the Website
  - Go back to **Properties → Static website hosting**
  - Open the **Bucket website endpoint URL**

**Result:** The frontend is now publicly accessible via S3 and successfully communicates with the serverless backend using API Gateway and Lambda.

---


### Step 7: Test Application

- Open **Bucket website endpoint URL**
- Enter name and message and click `Submit`
- Click View Messages and Verify:
  - The message appears on the webpage
  - The same message is stored in the DynamoDB table (`guestbook-table`)
    
**Result:** The serverless guestbook application is working correctly. Messages flow successfully from the frontend to AWS Lambda through API Gateway, are stored in DynamoDB, and are displayed back on the UI.

---

## Cost Safety

After testing, delete resources such as S3, Lambda, API Gateway, DynamoDB, and IAM roles to avoid unnecessary AWS charges.

---

## Screenshots
The screenshots/ directory contains key images showing the setup and working of the serverless guestbook application.
