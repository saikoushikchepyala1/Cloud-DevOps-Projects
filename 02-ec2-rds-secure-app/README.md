# Secure Application–Database Connectivity on AWS (EC2 + RDS)

This project demonstrates how to build a **secure 2-tier application architecture on AWS**, where a web application 
running on an EC2 instance connects **privately** to a managed MySQL database hosted on Amazon RDS.

---

## Project Overview

In real-world applications, databases should **never be directly exposed to the internet**.  
This project shows how to:

- Run a web application on an EC2 instance in a public subnet
- Host a database in private subnets using Amazon RDS
- Allow secure communication between EC2 and RDS
- Block all public access to the database
- Verify security through controlled access testing

---

## Architecture Overview

```text
User (Browser)
     |
 Internet
     |
Internet Gateway
     |
Public Subnet
     |
EC2 Application Server
     |
Application Security Group
     |
Database Security Group
     |
Private Subnet
     |
Amazon RDS (MySQL)
```

---

## Technologies Used

- AWS EC2
- Amazon RDS (MySQL)
- AWS VPC (Public & Private Subnets)
- Security Groups
- Apache Web Server
- PHP
- Linux (Ubuntu)

---

## Step-by-Step Implementation

### Step 1: Create a VPC

- Navigate to **AWS Console → VPC → Create VPC**
- Select **VPC only**
- Provide the following details:
  - **Name:** `the-vpc-02`
  - **IPv4 CIDR block:** `10.0.0.0/16`
    
- Click **Create VPC**

**Result:**  A VPC is created to provide an isolated network for the application and database.

---

### Step 2: Create Public and Private Subnets

- Navigate to **VPC → Subnets → Create subnet**
- Select the previously created VPC

**Public Subnet**
- **Subnet name:** `the-public-subnet-02`
- **CIDR block:** `10.0.1.0/24`
- Enable **Auto-assign public IPv4**

**Private Subnet**
- **Subnet name:** `the-private-subnet-02`
- **CIDR block:** `10.0.2.0/24`
- Keep **Auto-assign public IPv4 disabled**

**Result:**  The public subnet will host the EC2 application server, while the private subnet will host the database securely.

---

### Step 3: Create and Attach an Internet Gateway

- Navigate to **VPC → Internet Gateways → Create internet gateway**
- **Name:** `the-igw-02`
- Attach the Internet Gateway to **the-vpc-02**

**Result:**  The VPC is now connected to the internet, allowing public subnet resources to access external networks.

---

### Step 4: Configure Route Tables

- Navigate to **VPC → Route Tables**
- Create a new route table for the VPC

**Public Route Table**
- Add a route:
  - **Destination:** `0.0.0.0/0`
  - **Target:** Internet Gateway
- Associate the route table with the **public subnet (the-public-subnet-02)**

**Private Route Table**
- Keep only the default local route
- Associate the route table with the **private subnet (the-private-subnet-02)**

**Result:**  Only public subnet resources can access the internet; private subnet remains isolated.

---

### Step 5: Create Security Groups

- Navigate to **EC2 → Security Groups → Create security group**

**Application Security Group (the-app-sg-02)**
- Inbound rules:
  - **SSH (22)** → `Your IP`
  - **HTTP (80)** → `0.0.0.0/0`

**Database Security Group (the-db-sg-02)**
- Inbound rule:
  - **MySQL (3306)** → Source: **the-app-sg-02**

**Result:** The database accepts traffic only from the EC2 application server, not from the internet.

---

### Step 6: Launch the EC2 Instance

- Navigate to **EC2 → Launch Instance**
- Choose an **Ubuntu AMI**
- Choose instance type: `t2.micro` (Free Tier eligible)
- Create a key pair: `the-kp-02.pem`
  
- Configure network settings:
  - **VPC:** `the-vpc-02`
  - **Subnet:** Public subnet
  - Enable **Auto-assign public IP**
- Attach security group: `the-app-sg-02`
  
- Launch the instance 

**Result:**  The EC2 instance is running and publicly accessible via the internet.

---

### Step 7: Create a DB Subnet Group

- Amazon RDS requires a **DB subnet group** to define which **private subnets** the database can use.  
  For availability, the subnet group must include **at least two private subnets in different Availability Zones**.

- Navigate to **AWS Console → RDS → Subnet groups**
- Click **Create DB subnet group**
- Provide the following details:
  - **Name:** `the-db-private-subnet-group-02`
  - **Description:** Private subnet group for RDS
  - **VPC:** `the-vpc-02`

- Under **Add subnets**:
  - Select **two private subnets**
  - Ensure each subnet is in a **different Availability Zone**
  
  **NOTE:** If only one private subnet exists, create another in a different AZ before proceeding.

- Click **Create**

**Result:**  
A DB subnet group is created using private subnets across multiple Availability Zones, allowing Amazon RDS to deploy the database securely and reliably.

---


### Step 8: Create the RDS MySQL Database

- Navigate to **RDS → Create database**
  
- Choose **Full configuration**
  
- Configure:
  - **Engine type:** MySQL
  - **Template:** Free tier
  - **DB instance identifier:** `the-database-02`
  - **Master username:** `admin`
  - **Master password:** Create a password (self-managed) or manage it using AWS Secrets Manager
  - **DB instance class:** `db.t3.micro`
    
- Connectivity settings:
  - **VPC:** `the-vpc-02`
  - **DB subnet group:** `the-db-private-subnet-group-02`
  - **Public access:** No
  - **Security group:** `the-db-sg-02`
    
- Click **Create database**

**Result:**  A managed MySQL database is created securely inside private subnets.

---

### Step 9: Connect to EC2 and Install Required Application Packages

- From your local machine, connect to EC2 instance using SSH:
  ```bash
  ssh -i your-key.pem ubuntu@<EC2-PUBLIC-IP>
  ```
  
- Update the package index and install required packages for application:
  ```bash
  sudo apt update
  sudo apt install apache2 php php-mysql mysql-client -y
  ```
  
- Verify PHP is installed :
  ```bash
  php -v
  ```
    
- Start, enable, and verify the Apache web server:
  ```
  sudo systemctl start apache2
  sudo systemctl enable apache2
  sudo systemctl status apache2
  ```
  
- Verify by opening a browser and accessing the EC2 public IP:
  ```text
  http://<EC2-PUBLIC-IP>
  ```
  
**Result:** You are successfully logged in to the EC2 application server, and the default Apache welcome page is displayed, 
confirming that the Apache web server is installed and running successfully on the EC2 instance.

---

### Step 10: Deploy the Web Application on EC2

- Navigate to the Apache web root directory on the EC2 instance and remove the default Apache index file::
  ```bash
  cd /var/www/html
  sudo rm index.html
  ```
  
- Create a new PHP application file:
  ```bash
  sudo nano index.php
  ```
  
- Add PHP code that:
  - Establishes a connection to the Amazon RDS MySQL database using the RDS endpoint 
  - Accepts user input from the web interface
  - Inserts records into the database securely

- Save the file and exit the editor.
  
- Restart Apache to apply changes:
   ```bash
   sudo systemctl restart apache2
   ```
   
- Access the application in the browser:
   ```text
   http://<EC2-PUBLIC-IP>
   ```

**Result:** The application is successfully deployed and accessible through the EC2 instance.

---


### Step 11: Create Database Schema and Verify RDS Connectivity

- From the EC2 instance, connect to the RDS MySQL database:
  ```bash
  mysql -h <RDS-ENDPOINT> -u admin -p
  ```
- Enter the RDS master password

  **NOTE:** The RDS endpoint can be found in the **AWS Console → RDS → Databases → select your database → Connectivity & security section.**

- Create the database and required table:
  ```sql
  CREATE DATABASE feedbackdb;
  USE feedbackdb;

  CREATE TABLE feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(100),
    type VARCHAR(50),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```

- Verify table creation:
  ```sql
  SHOW TABLES;
  ```

**Result:** The database schema is created successfully, confirming successful connectivity between the EC2 application server and the Amazon RDS database.

---

### Step 12: Verify End-to-End Application Functionality

- Open the application in a web browser:
  ```text
  http://<EC2-PUBLIC-IP>
  ```
  
- Enter the data and click the **Submit** button.

- Verify the data in the database:
  ```sql
  SELECT * FROM feedback;
  ```

**Result:** Data entered through the web application is successfully stored and retrieved from the database.

---


### Step 13: Validate Database Security and Network Isolation

- From your local machine (outside AWS), attempt to connect to the RDS database:
  ```bash
  mysql -h <RDS-ENDPOINT> -u admin -p
  ```

- Expected Result: **Connection fails**

**Result:** The RDS database is private and inaccessible from the internet, validating proper VPC design and security group configuration.

---

### Step 14: Cost Safety

This project provisions AWS resources that can incur charges if they remain active.

After the implementation and verification are complete, the EC2 instance, RDS database, and related resources should be stopped or removed when they are no longer required.

**Result:** This helps maintain responsible cloud usage and prevents unnecessary costs.

---

## Screenshots

The `screenshots/` directory contains visual references for the infrastructure setup, security configuration, application interface, and database validation.

These screenshots support understanding of the architecture and clearly illustrate the implementation details.




