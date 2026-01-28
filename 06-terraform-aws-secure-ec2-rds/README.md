# Project 06 – Terraform AWS Secure EC2–RDS Infrastructure

This project demonstrates how to create a secure 2-tier application environment on AWS using Terraform.

The application runs on an EC2 instance in a public subnet, while the MySQL database runs on Amazon RDS inside private subnets. The application can connect to the database, but the database is not accessible from the internet.

This is the Terraform-based version of the EC2–RDS setup that was previously created using the AWS Console:
https://github.com/saikoushikchepyala1/Cloud-DevOps-Projects/blob/main/02-ec2-rds-secure-app

---

## Overview

The infrastructure includes:
- An EC2 instance in a public subnet
- An RDS MySQL database in private subnets
- Security groups to control access between the application and database
- All resources managed using Terraform

---

## Architecture

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
Private Subnet (Multi-AZ)
     |
Amazon RDS (MySQL)
```

---

## AWS Services Used

- Amazon VPC – Network isolation
- Amazon EC2 – Application server
- Amazon RDS (MySQL) – Managed relational database
- AWS Security Groups – Network-level access control
- AWS IAM – Authentication and authorization
- Terraform – Infrastructure as Code (IaC)

---

## Project Structure

```text
06-terraform-aws-secure-ec2-rds/
│
├── main.tf
├── provider.tf
├── variables.tf
├── terraform.tfvars
├── outputs.tf
├── backend.tf
│
├── modules/
│   ├── vpc/
│   ├── ec2/
│   └── rds/
│
└── screenshots/
```
---

## Prerequisites

To run this project locally, ensure the following are available on your local machine:

- An AWS account
- An IAM user with access keys
- AWS CLI installed and configured (`aws configure`)
- Terraform installed
- An EC2 key pair in the same AWS region
- Your public IP address for SSH access

Verify installations:
```bash
terraform version
aws --version
```

---

## Configuration

- Terraform uses the AWS CLI credentials configured on the local machine to authenticate with AWS.
  - Configure AWS CLI with your IAM user credentials:
  ```bash
  aws configure
  ```
  - Terraform automatically uses these credentials for authentication.

- Update the EC2 key pair name in `terraform.tfvars`:
```hcl
key_pair_name = "terraform-ec2-key"
```

- In the VPC module security group configuration, SSH access is restricted to a single IP address:
```hcl
cidr_blocks = ["YOUR_PUBLIC_IP/32"]
```
- Get your public IP address using:
```bash
curl ifconfig.me
```
**Note:** If your public IP address changes, update the SSH CIDR value and re-run `terraform apply`.

---

## Terraform State
- Terraform tracks infrastructure resources using a state file.
- When Terraform is run without any backend configuration, the state is stored locally in a file named `terraform.tfstate` within the project directory.
- This project is configured to store the Terraform state remotely in Amazon S3, with DynamoDB used for state locking. This ensures consistent state management and prevents concurrent changes during Terraform operations.

---

## Remote State Setup
- The Terraform state for this project is stored remotely to keep it consistent and to avoid conflicts during Terraform runs.
- Create the required AWS resources for remote state storage.
  - **Amazon S3** – Stores the Terraform state file
  - **Amazon DynamoDB** – Provides state locking

### Create S3 Bucket
```bash
aws s3api create-bucket \
  --bucket terraform-state-project-06 \
  --region ap-south-1 \
  --create-bucket-configuration LocationConstraint=ap-south-1
```

### Enable versioning on the bucket:
```bash
aws s3api put-bucket-versioning \
  --bucket terraform-state-project-06 \
  --versioning-configuration Status=Enabled
```

### Create DynamoDB Table
```bash
aws dynamodb create-table \
  --table-name terraform-state-locks \
  --billing-mode PAY_PER_REQUEST \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --region ap-south-1
```
---

## Backend Configuration
- Terraform uses the following backend configuration to store the state file in Amazon S3 with DynamoDB locking.
- Create a file named `backend.tf` in the project root:
```hcl
terraform {
  backend "s3" {
    bucket         = "terraform-state-project-06"
    key            = "project-06/terraform.tfstate"
    region         = "ap-south-1"
    dynamodb_table = "terraform-state-locks"
    encrypt        = true
  }
}
```
- This configuration tells Terraform to store the state file in Amazon S3
- DynamoDB handles state locking
- State data is encrypted at rest

---

## Running the Project
From the project directory, run:
```bash
terraform init
terraform plan
terraform apply
```
- Resource creation takes several minutes, especially for the RDS instance.
- After the apply step completes, Terraform outputs the public IP address of the EC2 instance.
- Access the application using:
  ```bash
  http://<EC2_PUBLIC_IP>
  ```
- The Apache default page confirms successful deployment.

---

## Verification

After deployment, the following are verified:

- The EC2 instance is running and accessible via the public IP
- The web server is reachable from a browser
- The RDS MySQL database is running in private subnets
- The database is not accessible from the internet
- Security group rules allow only required traffic
- Terraform state is stored in Amazon S3 with DynamoDB providing state locking

Screenshots for verification are available in the `screenshots/` directory.

---